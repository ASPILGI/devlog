import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AppLayout() {
  return (
    <div className="app">
      <Header />

      <main style={{ minHeight: '80vh', padding: '24px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
