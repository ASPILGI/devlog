import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import PostsPage from './pages/PostsPage'
import WritePage from './pages/WritePage'
import RequireAuth from './components/RequireAuth'
import PostDetailPage from './pages/PostDetailPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/posts"
          element={
            <RequireAuth>
              <PostsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/write"
          element={
            <RequireAuth>
              <WritePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/posts" replace />} />
        <Route
          path="/posts/:id"
          element={
            <RequireAuth>
              <PostDetailPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
