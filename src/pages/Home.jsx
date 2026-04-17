import { Box, Typography } from '@mui/material'

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Ghost Rate</Typography>
      <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
        Know before you apply.
      </Typography>
    </Box>
  )
}
