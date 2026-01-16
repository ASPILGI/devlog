import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

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
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Posts</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/write">글쓰기</Link>
          <button onClick={reload}>새로고침</button>
          <button onClick={logout}>로그아웃</button>
        </div>
      </div>

      {refreshedAt && (
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>마지막 갱신: {refreshedAt}</p>
      )}

      {errMsg && <p style={{ marginTop: 12 }}>{errMsg}</p>}

      <ul style={{ lineHeight: 1.9 }}>
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}`} style={{ textDecoration: 'none' }}>
              <b>{p.title}</b>
            </Link>{' '}
            <span style={{ opacity: 0.7 }}>#{p.id}</span>{' '}
            <span style={{ opacity: 0.7 }}>userId={p.userId}</span>
          </li>
        ))}
      </ul>

      {posts.length === 0 && !errMsg && <p>게시글이 없습니다.</p>}
    </div>
  )
}
