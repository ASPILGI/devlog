import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import './PostsPage.css'

export default function PostsPage() {
  const nav = useNavigate()
  const [posts, setPosts] = useState([])
  const [errMsg, setErrMsg] = useState('')
  const [refreshedAt, setRefreshedAt] = useState('')

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    nav('/login')
  }

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/v1/posts?page=0&size=10')
        setPosts(res.data?.data?.content || [])
        setErrMsg('')
      } catch (e) {
        setErrMsg(e?.response?.data?.error?.message || '목록 조회 실패')
      }
    })()
  }, [])

  const reload = async () => {
    try {
      const res = await api.get('/v1/posts?page=0&size=10')
      setPosts(res.data?.data?.content || [])
      setErrMsg('')
      setRefreshedAt(new Date().toLocaleTimeString())
    } catch (e) {
      setErrMsg(e?.response?.data?.error?.message || '목록 조회 실패')
    }
  }

  return (
    <div className="postsPage">
      <div className="postsHeader">
        <div>
          <h1 className="postsTitle">Posts</h1>
          <p className="postsDesc">Devlog에 기록된 백엔드 설계 및 운영 관련 글 목록입니다.</p>
        </div>

        <div className="postsTools">
          <Link to="/write">글쓰기</Link>
          <button onClick={reload}>새로고침</button>
          <button onClick={logout}>로그아웃</button>
        </div>
      </div>

      {refreshedAt && <p className="muted">마지막 갱신: {refreshedAt}</p>}
      {errMsg && <p style={{ marginTop: 12 }}>{errMsg}</p>}

      <ul className="postsList">
        {posts.map((p) => (
          <li key={p.id} className="postItem">
            <Link to={`/posts/${p.id}`} className="postLink">
              {p.title}
            </Link>

            {/* ✅ 디버그 정보(#id, userId) 제거하고 사람이 읽는 메타로 */}
            <div className="postMeta">by aspilgi · {formatDate(p.createdAt)}</div>
          </li>
        ))}
      </ul>

      {posts.length === 0 && !errMsg && <p className="empty">게시글이 없습니다.</p>}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate(),
  ).padStart(2, '0')}`
}
