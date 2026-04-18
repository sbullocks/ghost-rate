import { Box, Typography, Chip, Divider, Rating } from '@mui/material'

const STAGE_LABELS = {
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  technical_interview: 'Technical Interview',
  take_home: 'Take Home Project',
  final_round: 'Final Round',
  offer: 'Received Offer',
}

function Fact({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="caption" fontWeight={600} color={value === 'Yes' ? 'success.main' : value === 'No' ? 'error.main' : 'text.primary'}>
        {value}
      </Typography>
    </Box>
  )
}

export default function ReviewCard({ review }) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.paper', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label={STAGE_LABELS[review.stage] || review.stage} size="small" variant="outlined" />
          {review.moderation_status === 'pending' && (
            <Chip label="Pending approval" size="small" color="warning" variant="outlined" />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">{date}</Typography>
      </Box>

      <Rating value={review.overall_score} readOnly size="small" sx={{ mb: 1.5 }} />

      <Divider sx={{ mb: 1 }} />

      <Fact label="Application acknowledged" value={review.received_acknowledgment ? 'Yes' : 'No'} />
      <Fact label="Communicated timeline" value={review.communicated_timeline ? 'Yes' : 'No'} />
      <Fact label="Ghosted" value={review.ghosted ? 'Yes' : 'No'} />
      <Fact label="Received rejection" value={review.received_rejection ? 'Yes' : 'No'} />
      {review.received_rejection && (
        <Fact label="Rejection had feedback" value={review.rejection_had_feedback ? 'Yes' : 'No'} />
      )}
      <Fact label="Interview rounds" value={review.rounds_count === 4 ? '4+' : String(review.rounds_count)} />
    </Box>
  )
}
