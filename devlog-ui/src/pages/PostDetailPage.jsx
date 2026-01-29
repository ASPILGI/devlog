import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { getMyUserId } from '../lib/auth'
import './PostDetailPage.css'

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
    <div className="postDetail">
      {/* 상단: 목록/새로고침 */}
      <div className="postTop">
        <div className="postTopLeft">
          <Link to="/posts">목록</Link>
          <button onClick={load}>새로고침</button>
        </div>
      </div>

      {errMsg && <p style={{ marginTop: 12 }}>{errMsg}</p>}

      {post && (
        <div>
          {/* 제목/메타 + 액션 버튼 */}
          <div className="postHeader">
            <div>
              <h1 className="postTitle">{post.title}</h1>

              {/* ✅ 디버그 정보 제거하고 “사람이 읽는 메타”로 교체 */}
              <div className="postMeta">by aspilgi · {formatDate(post.createdAt)}</div>
            </div>

            {isMine && (
              <div className="postActions">
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

          {/* 본문/편집 */}
          {!isEditing ? (
            <div className="postContent">{post.content}</div>
          ) : (
            <div className="editBox">
              <input
                className="editInput"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목"
              />
              <textarea
                className="editTextarea"
                rows={12}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용"
              />
            </div>
          )}

          {!isMine && (
            <p className="helperText">
              내 글이 아니면 수정/삭제 버튼이 보이지 않습니다. (권한 정책)
            </p>
          )}
        </div>
      )}
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
