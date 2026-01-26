import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PostsPage from './pages/PostsPage'
import WritePage from './pages/WritePage'
import RequireAuth from './components/RequireAuth'
import PostDetailPage from './pages/PostDetailPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 공개 랜딩 */}
        <Route path="/" element={<HomePage />} />

        {/* 로그인 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 게시글 읽기는 공개로 풀기 (첫인상 개선 핵심) */}
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />

        {/* 글쓰기만 보호 */}
        <Route
          path="/write"
          element={
            <RequireAuth>
              <WritePage />
            </RequireAuth>
          }
        />

        {/* 기본 리다이렉트는 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
