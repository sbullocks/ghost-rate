import { Box, Typography, Button, Avatar, Stack } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user, signInWithLinkedIn, signOut } = useAuth()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 3, p: 4 }}>
      <Typography variant="h3" fontWeight={900}>Ghost Rate</Typography>
      <Typography variant="h6" color="text.secondary">Know before you apply.</Typography>

      {user ? (
        <Stack alignItems="center" gap={2}>
          <Avatar src={user.user_metadata?.picture || user.user_metadata?.avatar_url} sx={{ width: 48, height: 48 }} />
          <Typography variant="body1">Welcome, {user.user_metadata?.name || user.user_metadata?.full_name}</Typography>
          <Button variant="outlined" color="secondary" onClick={signOut}>Sign out</Button>
        </Stack>
      ) : (
        <Button variant="contained" size="large" onClick={signInWithLinkedIn}
          sx={{ backgroundColor: '#0A66C2', '&:hover': { backgroundColor: '#004182' } }}>
          Sign in with LinkedIn
        </Button>
      )}
    </Box>
  )
}
