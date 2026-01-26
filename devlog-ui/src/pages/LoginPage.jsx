import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../lib/api'

export default function LoginPage() {
  const nav = useNavigate()
  const location = useLocation()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ /login?redirect=/home 같은 형태 지원
  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('redirect') || '/home'
  }, [location.search])

  const saveTokensAndGo = (res) => {
    const accessToken = res.data?.data?.accessToken
    const refreshToken = res.data?.data?.refreshToken

    if (!accessToken) {
      setErrMsg('로그인 응답에 accessToken이 없습니다.')
      return
    }

    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

    nav(redirectTo)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    setLoading(true)

    try {
      const res = await api.post('/v1/users/login', { loginId, password })
      saveTokensAndGo(res)
    } catch (e2) {
      setErrMsg(e2?.response?.data?.error?.message || '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  // ✅ 데모 계정 (Day22: 고정 계정 방식)
  const onDemoLogin = async () => {
    setErrMsg('')
    setLoading(true)

    try {
      const res = await api.post('/v1/users/login', {
        loginId: 'demo', // 👈 네 서버에 맞게 바꿔 (예: demo / demo1234!)
        password: 'demo1234!',
      })
      saveTokensAndGo(res)
    } catch (e2) {
      setErrMsg(e2?.response?.data?.error?.message || '데모 로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Devlog Login</h2>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="loginId"
          autoComplete="username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          autoComplete="current-password"
        />
        <button disabled={loading}>{loading ? '처리 중...' : '로그인'}</button>
      </form>

      {/* ✅ 안내 문구 */}
      <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
        읽기는 로그인 없이 가능합니다. 작성/수정/삭제는 로그인 후 이용할 수 있어요.
      </p>

      {/* ✅ 구분선 + 데모 로그인 */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.6 }}>
          <div style={{ flex: 1, height: 1, background: '#ddd' }} />
          <span style={{ fontSize: 12 }}>또는</span>
          <div style={{ flex: 1, height: 1, background: '#ddd' }} />
        </div>

        <button
          type="button"
          onClick={onDemoLogin}
          disabled={loading}
          style={{ width: '100%', marginTop: 12 }}
        >
          {loading ? '처리 중...' : '데모 계정으로 로그인'}
        </button>
      </div>

      {errMsg && <p style={{ marginTop: 12, color: 'crimson' }}>{errMsg}</p>}
    </div>
  )
}
