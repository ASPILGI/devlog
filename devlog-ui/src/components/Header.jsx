import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Header() {
  const nav = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [me, setMe] = useState(null)
  const [loadingMe, setLoadingMe] = useState(false)

  const goLogin = () => nav('/login?redirect=/')

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    setMe(null)
    nav('/')
  }

  // 최초 렌더 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const loggedIn = !!token
    setIsLoggedIn(loggedIn)

    if (!loggedIn) return
    ;(async () => {
      setLoadingMe(true)
      try {
        const res = await api.get('/v1/users/me')
        setMe(res?.data?.data || null)
      } catch (e) {
        setMe(null)
      } finally {
        setLoadingMe(false)
      }
    })()
  }, [])

  return (
    <header
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: '#fff',
        zIndex: 1000,
      }}
    >
      {/* 좌측 브랜드 */}
      <div
        onClick={() => nav('/')}
        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
      >
        Devlog
      </div>

      {/* 우측 메뉴 */}
      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/posts">Posts</Link>
        <Link to="/about">About</Link>

        {!isLoggedIn ? (
          <button className="btn" onClick={goLogin}>
            Login
          </button>
        ) : (
          <>
            <button className="btn ghost" onClick={() => nav('/write')}>
              Write
            </button>

            <button className="btn ghost" onClick={logout}>
              Logout
            </button>

            {me?.nickname && !loadingMe && (
              <span style={{ fontSize: 13, opacity: 0.8 }}>{me.nickname}님</span>
            )}
          </>
        )}

        <a href="https://github.com/ASPILGI/devlog" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  )
}
