import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'

export default function WritePage() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')

    try {
      await api.post('/v1/posts', { title, content })
      nav('/posts')
    } catch (e2) {
      setErrMsg(e2?.response?.data?.error?.message || '작성 실패')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Write</h2>
        <Link to="/posts">목록</Link>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button>등록</button>
      </form>

      {errMsg && <p style={{ marginTop: 12 }}>{errMsg}</p>}
    </div>
  )
}
