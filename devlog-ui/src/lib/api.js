import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ 요청마다 accessToken 자동 첨부 (headers 안전 처리)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== 401 자동 재발급(Refresh) 처리 =====
let isRefreshing = false;
let waitQueue = []; // (token) => void 콜백 배열

function flushQueue(token) {
  waitQueue.forEach((cb) => cb(token));
  waitQueue = [];
}

// ===== response interceptor =====
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err?.config;
    if (!original) return Promise.reject(err);

    const url = original.url || "";
    const method = (original.method || "").toLowerCase();

    // ✅ 토큰이 "없는 상태"에서만 posts 조회를 public 취급
    // (로그인 상태인데 401이 나오면 refresh로 복구해야 함)
    const hasToken = !!localStorage.getItem("accessToken");
    const isPublicGet =
      !hasToken &&
      method === "get" &&
      (url.startsWith("/v1/posts") || url.startsWith("/v1/posts/"));

    if (status !== 401) {
      return Promise.reject(err);
    }

    // 로그인 / 재발급 실패는 그대로 로그인 이동
    if (url.includes("/v1/users/login") || url.includes("/v1/users/reissue")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    }

    // ✅ 비로그인에서 posts 조회 401이면 여기서 끝 (리다이렉트/리프레시 X)
    if (isPublicGet) {
      return Promise.reject(err);
    }

    // ===== refresh 로직 =====
    if (original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push((token) => {
          if (!token) return reject(err);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

      const res = await api.post("/v1/users/reissue", { refreshToken });
      const newAccess = res?.data?.data?.accessToken;
      if (!newAccess) throw new Error("NO_ACCESS_TOKEN");

      localStorage.setItem("accessToken", newAccess);
      flushQueue(newAccess);

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (e) {
      flushQueue(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
