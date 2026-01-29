import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AppLayout from './layout/AppLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PostsPage from './pages/PostsPage'
import WritePage from './pages/WritePage'
import PostDetailPage from './pages/PostDetailPage'
import AboutPage from './pages/AboutPage'
import RequireAuth from './components/RequireAuth'
import SignupPage from './pages/SignupPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 공통 레이아웃 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/write"
            element={
              <RequireAuth>
                <WritePage />
              </RequireAuth>
            }
          />
        </Route>

        {/* 레이아웃 없는 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
