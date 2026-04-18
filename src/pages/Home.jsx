import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  Chip,
  Divider,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import SearchBar from '../components/SearchBar'

const FEATURES = [
  { label: 'Ghost Rate', desc: 'How often they go silent' },
  { label: 'Response Quality', desc: 'Acknowledgment & timelines' },
  { label: 'Rejection Feedback', desc: 'Do they explain why?' },
]

export default function Home() {
  const { user, signInWithLinkedIn, signOut } = useAuth()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 5,
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Hero */}
      <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
        <Typography
          variant="h2"
          fontWeight={900}
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.75rem' },
            letterSpacing: '-0.5px',
            mb: 2,
          }}
        >
          Ghost Rate
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.15rem' },
          }}
        >
          Community ratings of company hiring processes; not jobs, not culture.
          Did they respond? Did they ghost you? Did the rejection include real
          feedback?
        </Typography>
      </Box>

      {/* Search */}
      <SearchBar />

      {/* Feature chips */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={4}
        alignItems="center"
      >
        {FEATURES.map((f) => (
          <Box
            key={f.label}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}
          >
            <Chip label={f.label} variant="outlined" size="small" />
            <Typography variant="caption" color="text.secondary">
              {f.desc}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ width: '100%', maxWidth: 560 }} />

      {/* Auth row */}
      {user ? (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src={user.user_metadata?.picture || user.user_metadata?.avatar_url}
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="body2" color="text.secondary">
            {user.user_metadata?.name || user.user_metadata?.full_name}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={signOut}
            sx={{
              color: 'text.secondary',
              borderColor: 'divider',
              fontSize: '0.75rem',
            }}
          >
            Sign out
          </Button>
        </Stack>
      ) : (
        <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 560 }}>
          <Button
            variant="contained"
            onClick={signInWithLinkedIn}
            size="large"
            sx={{
              backgroundColor: '#0A66C2',
              '&:hover': { backgroundColor: '#004182' },
              px: 4,
              display: 'block',
              mx: 'auto',
            }}
          >
            Sign in with LinkedIn to leave a review
          </Button>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1.5, display: 'block' }}
          >
            LinkedIn sign-in keeps reviews tied to real hiring experiences.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
