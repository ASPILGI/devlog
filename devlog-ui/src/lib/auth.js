export function getMyUserId() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const payload = JSON.parse(json);

    // 너 토큰 payload에서 sub가 "15" 이런 문자열로 들어옴
    const sub = payload?.sub;
    return sub ? Number(sub) : null;
  } catch {
    return null;
  }
}
