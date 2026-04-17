import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CompanyProfile from './pages/CompanyProfile'
import SubmitReview from './pages/SubmitReview'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company/:domain" element={<CompanyProfile />} />
      <Route path="/review/:domain" element={<SubmitReview />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
