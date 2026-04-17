import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, Button, Skeleton, Divider } from '@mui/material'
import { useGetCompanyByDomainQuery } from '../store/companiesApi'
import { useAuth } from '../hooks/useAuth'
import ScoreCard from '../components/ScoreCard'
import { getLogoUrl } from '../utils/clearbit'

export default function CompanyProfile() {
  const { domain } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: company, isLoading, isError } = useGetCompanyByDomainQuery(domain)

  if (isLoading) return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
    </Box>
  )

  if (isError || !company) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="text.secondary">Company not found.</Typography>
      <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Go back</Button>
    </Box>
  )

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Button onClick={() => navigate('/')} size="small" sx={{ mb: 3, color: 'text.secondary' }}>
        ← Back to search
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Avatar
          src={getLogoUrl(company.domain)}
          variant="rounded"
          sx={{ width: 64, height: 64, bgcolor: 'background.paper' }}
        />
        <Box>
          <Typography variant="h4" fontWeight={800}>{company.name}</Typography>
          <Typography variant="body2" color="text.secondary">{company.domain}</Typography>
        </Box>
      </Box>

      <ScoreCard data={company} />

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>Hiring Experience Reviews</Typography>
        {user ? (
          <Button variant="contained" onClick={() => navigate(`/review/${domain}`)}>
            Leave a Review
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Sign in to leave a review
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 4 }}>
          Reviews will appear here once approved.
        </Typography>
      </Box>
    </Box>
  )
}
