import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import './HomePage.css'

export default function HomePage() {
  const nav = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [me, setMe] = useState(null) // { nickname, loginId, ... }
  const [loadingMe, setLoadingMe] = useState(false)

  const goLogin = () => nav('/login?redirect=/home')

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    setMe(null)
    nav('/')
  }

  // ✅ 최초 렌더 시 토큰 있으면 /me 조회해서 "진짜 로그인 상태" 연출
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
        // /me가 실패하면 (토큰 만료/오류) -> api 인터셉터에서 처리될 확률이 큼
        // 그래도 UI가 엉키지 않게 방어
        setMe(null)
      } finally {
        setLoadingMe(false)
      }
    })()
  }, [])

  return (
    <div className="home">
      <header className="homeTop">
        <div className="brand" onClick={() => nav('/')}>
          <div className="dot" />
          <div>
            <div className="title">Devlog</div>
            <div className="sub">JWT · 권한 · Docker · AWS 운영</div>
          </div>
        </div>

        <nav className="nav">
          <button className="btn ghost" onClick={() => nav('/posts')}>
            둘러보기
          </button>

          {!isLoggedIn ? (
            <button className="btn" onClick={goLogin}>
              로그인
            </button>
          ) : (
            <>
              <button className="btn" onClick={() => nav('/home')}>
                {loadingMe ? '로딩…' : me?.nickname ? `${me.nickname}님` : '대시보드'}
              </button>
              <button className="btn ghost" onClick={logout}>
                로그아웃
              </button>
            </>
          )}

          <a
            className="link"
            href="https://github.com/ASPILGI/devlog"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className="wrap">
        <section className="hero">
          <h1>
            로그인 없이도 프로젝트를 볼 수 있게 만든 <span>운영형 백엔드</span> 포트폴리오
          </h1>
          <p>
            Spring Security + JWT(Access/Refresh) 인증/인가, 예외 처리 표준화, Docker 기반 배포까지
            실무 기준으로 구성했습니다.
          </p>

          {/* ✅ 로그인 상태일 때 환영 문구로 "변한 느낌" 확실하게 */}
          {isLoggedIn && (
            <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85 }}>
              {loadingMe
                ? '로그인 정보를 불러오는 중…'
                : me?.nickname
                  ? `✅ ${me.nickname}님, 환영합니다! (데모 계정이면 체험용으로 사용 중입니다)`
                  : '✅ 로그인 상태입니다.'}
            </div>
          )}

          <div className="cta">
            <button className="btn primary" onClick={() => nav('/posts')}>
              게시글 둘러보기
            </button>

            {!isLoggedIn ? (
              <button className="btn ghost" onClick={goLogin}>
                데모로 체험하기
              </button>
            ) : (
              <button className="btn ghost" onClick={() => nav('/write')}>
                글 작성하기
              </button>
            )}
          </div>
        </section>

        <section className="grid">
          <Card
            title="Authentication"
            body="JWT Access/Refresh, 만료/재발급 흐름, Security Filter 분리"
          />
          <Card
            title="Authorization"
            body="역할 기반 접근 제어, 401/403 일관 응답, 비즈니스 권한 분기"
          />
          <Card
            title="Architecture"
            body="ApiResponse 통일, BusinessException/ErrorCode, 트랜잭션 패턴"
          />
          <Card
            title="Deployment"
            body="Docker로 로컬/운영 동일화, EC2 배포, 운영 점검(로그/상태 확인)"
          />
        </section>
      </main>

      <footer className="footer">© {new Date().getFullYear()} Devlog · Portfolio</footer>
    </div>
  )
}

function Card({ title, body }) {
  return (
    <div className="card">
      <div className="cardTitle">{title}</div>
      <div className="cardBody">{body}</div>
    </div>
  )
}
