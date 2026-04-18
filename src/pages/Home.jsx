import { Box, Typography, Button, Avatar, Stack } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import SearchBar from '../components/SearchBar'

export default function Home() {
  const { user, signInWithLinkedIn, signOut } = useAuth()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 4, p: { xs: 2, sm: 4 } }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>Ghost Rate</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Know before you apply.
        </Typography>
      </Box>

      <SearchBar />

      {user ? (
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Avatar src={user.user_metadata?.picture || user.user_metadata?.avatar_url} sx={{ width: 32, height: 32 }} />
          <Typography variant="body2" color="text.secondary">
            {user.user_metadata?.name || user.user_metadata?.full_name}
          </Typography>
          <Button size="small" variant="text" color="inherit" onClick={signOut} sx={{ color: 'text.secondary' }}>
            Sign out
          </Button>
        </Stack>
      ) : (
        <Button variant="contained" onClick={signInWithLinkedIn}
          sx={{ backgroundColor: '#0A66C2', '&:hover': { backgroundColor: '#004182' } }}>
          Sign in with LinkedIn
        </Button>
      )}
    </Box>
  )
}
