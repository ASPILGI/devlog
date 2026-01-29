import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ 요청마다 accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== 공개 페이지에서는 401이어도 로그인 강제 이동 금지 =====
function shouldRedirectToLogin() {
  const path = window.location.pathname;

  // 공개로 둘 페이지들
  const isPublic =
    path === "/" ||
    path.startsWith("/posts") ||
    path.startsWith("/login");

  return !isPublic;
}

function redirectToLoginWithReturn() {
  const redirect = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  window.location.href = `/login?redirect=${redirect}`;
}

// ===== 401 자동 재발급(Refresh) 처리 =====
let isRefreshing = false;
let waitQueue = []; // (token) => void

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

    if (status !== 401) {
      return Promise.reject(err);
    }

    // ✅ 로그인/재발급 자체가 401이면: 토큰 정리 + (보호페이지일 때만) 로그인 이동
    if (url.includes("/v1/users/login") || url.includes("/v1/users/reissue")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (shouldRedirectToLogin()) {
        redirectToLoginWithReturn();
      }
      return Promise.reject(err);
    }

    // ===== refresh 로직 =====
    if (original._retry) {
      // 이미 재시도했는데도 401이면: 토큰 정리 + (보호페이지일 때만) 로그인 이동
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (shouldRedirectToLogin()) {
        redirectToLoginWithReturn();
      }
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

      // ⚠️ reissue는 refreshToken만 보내는 걸로 가정
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

      // ✅ 공개 페이지면 홈 유지, 보호 페이지면 로그인 이동
      if (shouldRedirectToLogin()) {
        redirectToLoginWithReturn();
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
