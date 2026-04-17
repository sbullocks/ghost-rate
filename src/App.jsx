import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import CompanyProfile from './pages/CompanyProfile'
import SubmitReview from './pages/SubmitReview'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'

export default function App() {
  useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company/:domain" element={<CompanyProfile />} />
      <Route path="/review/:domain" element={<SubmitReview />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
