import { Box, Typography, Chip, Tooltip } from '@mui/material'

function Stat({ label, value, tooltip, color }) {
  return (
    <Tooltip title={tooltip} arrow>
      <Box sx={{ textAlign: 'center', cursor: 'default' }}>
        <Typography variant="h5" fontWeight={800} color={color || 'text.primary'}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
    </Tooltip>
  )
}

export default function ScoreCard({ data }) {
  if (!data || !data.review_count || data.review_count < 5) {
    return (
      <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          Score summary unlocks after 5 reviews.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Stat label="Overall Score" value={`${data.avg_score} / 5`} tooltip="Average candidate rating" />
      <Stat label="Ghost Rate" value={`${data.ghost_rate}%`} tooltip="% of candidates who were ghosted" color={data.ghost_rate > 50 ? 'error.main' : 'success.main'} />
      <Stat label="Acknowledged" value={`${data.acknowledgment_rate}%`} tooltip="% who received application acknowledgment" />
      <Stat label="Gave Feedback" value={`${data.feedback_rate}%`} tooltip="% of rejections that included real feedback" />
      <Box sx={{ textAlign: 'center' }}>
        <Chip label={`${data.review_count} reviews`} size="small" variant="outlined" />
      </Box>
    </Box>
  )
}
