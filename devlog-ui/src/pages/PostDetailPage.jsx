import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { getMyUserId } from '../lib/auth'

export default function PostDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()

  const myUserId = useMemo(() => getMyUserId(), [])
  const [post, setPost] = useState(null)
  const [errMsg, setErrMsg] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const load = async () => {
    setErrMsg('')
    try {
      const res = await api.get(`/v1/posts/${id}`)
      const data = res.data?.data || null
      setPost(data)

      // 편집 초기값 세팅
      setEditTitle(data?.title ?? '')
      setEditContent(data?.content ?? '')
    } catch (e) {
      setErrMsg(e?.response?.data?.error?.message || '상세 조회 실패')
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const isMine = post && myUserId != null && Number(post.userId) === Number(myUserId)

  const onUpdate = async () => {
    setErrMsg('')
    try {
      await api.put(`/v1/posts/${id}`, {
        title: editTitle,
        content: editContent,
      })
      setIsEditing(false)
      await load() // 최신 데이터 다시 로드
    } catch (e) {
      setErrMsg(e?.response?.data?.error?.message || '수정 실패')
    }
  }

  const onDelete = async () => {
    const ok = window.confirm('정말 삭제할까?')
    if (!ok) return

    setErrMsg('')
    try {
      await api.delete(`/v1/posts/${id}`)
      nav('/posts')
    } catch (e) {
      setErrMsg(e?.response?.data?.error?.message || '삭제 실패')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Post Detail</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/posts">목록</Link>
          <button onClick={load}>새로고침</button>
        </div>
      </div>

      {errMsg && <p style={{ marginTop: 12 }}>{errMsg}</p>}

      {post && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ marginBottom: 6 }}>{post.title}</h3>
              <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 12 }}>
                <span>id: {post.id}</span>{' '}
                <span style={{ marginLeft: 10 }}>userId: {post.userId}</span>{' '}
                <span style={{ marginLeft: 10 }}>createdAt: {post.createdAt}</span>
              </div>
            </div>

            {isMine && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                {!isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(true)}>수정</button>
                    <button onClick={onDelete}>삭제</button>
                  </>
                ) : (
                  <>
                    <button onClick={onUpdate}>저장</button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditTitle(post.title ?? '')
                        setEditContent(post.content ?? '')
                      }}
                    >
                      취소
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {!isEditing ? (
            <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.content}</pre>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <textarea
                rows={10}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
          )}

          {!isMine && (
            <p style={{ opacity: 0.6, fontSize: 12, marginTop: 16 }}>
              내 글이 아니면 수정/삭제 버튼이 보이지 않습니다. (권한 정책)
            </p>
          )}
        </div>
      )}
    </div>
  )
}
