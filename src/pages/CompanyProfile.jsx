import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function CompanyProfile() {
  const { domain } = useParams()
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">{domain}</Typography>
    </Box>
  )
}
