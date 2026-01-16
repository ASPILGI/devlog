import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// 요청마다 accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===== 401 자동 재발급(Refresh) 처리 =====
let isRefreshing = false;
let waitQueue = []; // (token) => void 콜백 배열

function flushQueue(token) {
  waitQueue.forEach((cb) => cb(token));
  waitQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err && err.response ? err.response.status : null;
    const original = err ? err.config : null;

    // 401 아니면 그대로
    if (status !== 401 || !original) {
      return Promise.reject(err);
    }

    const url = original.url || "";

    // 로그인/재발급 요청 자체가 401이면 => 진짜 로그아웃
    if (url.includes("/v1/users/login") || url.includes("/v1/users/reissue")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    }

    // 무한루프 방지
    if (original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;

    // 이미 refresh 중이면 대기열에 태움
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

      // body로 refreshToken 받음
      const res = await api.post("/v1/users/reissue", { refreshToken });
      const newAccess = res && res.data && res.data.data ? res.data.data.accessToken : null;

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
