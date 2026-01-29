import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function SignupPage() {
  const nav = useNavigate()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')

    // 간단 프론트 검증(백엔드 검증이 메인)
    if (!loginId || !password || !nickname || !email) {
      setErrMsg('모든 항목을 입력해줘.')
      return
    }

    setLoading(true)
    try {
      await api.post('/v1/users/signup', {
        loginId,
        password,
        nickname,
        email,
      })

      // 가입 성공 → 로그인으로 이동 (바로 글쓰게 유도해도 OK)
      nav('/login?redirect=/write')
    } catch (e2) {
      setErrMsg(e2?.response?.data?.error?.message || '회원가입 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 6 }}>회원가입</h1>
      <p style={{ marginTop: 0, color: '#666', fontSize: 14, lineHeight: 1.5 }}>
        Devlog 포트폴리오를 체험하기 위한 계정을 생성합니다. <br />
        (방문자는 로그인 없이 글 열람 가능)
      </p>

      {errMsg && <p style={{ color: '#b00020', marginTop: 12 }}>{errMsg}</p>}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, marginTop: 18 }}>
        <input
          placeholder="아이디 (loginId)"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          autoComplete="username"
        />
        <input
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <button disabled={loading} type="submit">
          {loading ? '생성 중…' : '계정 생성'}
        </button>
      </form>

      <div style={{ marginTop: 14, fontSize: 13 }}>
        이미 계정이 있나? <Link to="/login">로그인</Link>
      </div>
    </div>
  )
}
