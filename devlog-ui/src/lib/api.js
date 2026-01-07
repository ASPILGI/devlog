import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {"Content-Type": "application/json" },
});

// 요청마다 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config
});

// 401이면 로그아웃(=토큰제거) + 로그인 화면 유도
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;