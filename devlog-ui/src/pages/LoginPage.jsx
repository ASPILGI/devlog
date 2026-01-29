import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../lib/api'

export default function LoginPage() {
  const nav = useNavigate()
  const location = useLocation()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ redirect는 "로그인 성공 후"에만 사용
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    setLoading(true)

    try {
      const res = await api.post('/v1/users/login', { loginId, password })

      const accessToken = res.data?.data?.accessToken
      const refreshToken = res.data?.data?.refreshToken

      if (!accessToken) {
        setErrMsg('로그인 응답에 accessToken이 없습니다.')
        return
      }

      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

      nav(redirect) // ✅ 여기서만 이동
    } catch (e) {
      setErrMsg(e?.response?.data?.error?.message || '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setErrMsg('')
    setLoading(true)

    try {
      const res = await api.post('/v1/users/login', {
        loginId: 'demo',
        password: 'demo1234!',
      })

      const accessToken = res.data?.data?.accessToken
      const refreshToken = res.data?.data?.refreshToken

      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

      nav('/') // ✅ 데모는 무조건 홈
    } catch (e) {
      setErrMsg('데모 로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Devlog Login</h2>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="loginId" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        <button disabled={loading}>{loading ? '처리 중...' : '로그인'}</button>
      </form>

      <button style={{ marginTop: 12, width: '100%' }} onClick={demoLogin} disabled={loading}>
        데모 계정으로 체험하기
      </button>

      {errMsg && <p style={{ marginTop: 12, color: 'crimson' }}>{errMsg}</p>}
      <div style={{ marginTop: 12, fontSize: 13 }}>
        계정이 없나? <Link to="/signup">회원가입</Link>
      </div>
    </div>
  )
}
