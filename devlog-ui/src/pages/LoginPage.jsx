import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function LoginPage() {
  const nav = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      const res = await api.post("/api/v1/users/login", { loginId, password });

      const accessToken = res.data?.data?.accessToken;
      const refreshToken = res.data?.data?.refreshToken;

      if (!accessToken) {
        setErrMsg("로그인 응답에 accessToken이 없습니다.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      nav("/posts");
    } catch (e2) {
      setErrMsg(e2?.response?.data?.error?.message || "로그인 실패");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Devlog Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="loginId" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <button>로그인</button>
      </form>

      {errMsg && <p style={{ marginTop: 12 }}>{errMsg}</p>}
    </div>
  );
}
