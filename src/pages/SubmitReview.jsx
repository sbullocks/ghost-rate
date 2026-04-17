import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Stepper, Step, StepLabel,
  ToggleButtonGroup, ToggleButton, Rating, Alert,
  TextField, Divider, CircularProgress
} from '@mui/material'
import { useGetCompanyByDomainQuery } from '../store/companiesApi'
import { useSubmitReviewMutation } from '../store/reviewsApi'
import { useAuth } from '../hooks/useAuth'

const STAGES = [
  { value: 'applied', label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'final_round', label: 'Final Round' },
  { value: 'offer', label: 'Received Offer' },
]

const STEPS = ['Your Experience', 'The Process', 'Overall Rating']

function YesNo({ label, value, onChange }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
      <Typography variant="body2">{label}</Typography>
      <ToggleButtonGroup exclusive value={value} onChange={(_e, v) => v !== null && onChange(v)} size="small">
        <ToggleButton value={true} sx={{ px: 2.5 }}>Yes</ToggleButton>
        <ToggleButton value={false} sx={{ px: 2.5 }}>No</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default function SubmitReview() {
  const { domain } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: company } = useGetCompanyByDomainQuery(domain)
  const [submitReview, { isLoading }] = useSubmitReviewMutation()

  const [step, setStep] = useState(0)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    stage: 'applied',
    application_date: '',
    last_interaction_date: '',
    received_acknowledgment: null,
    communicated_timeline: null,
    ghosted: null,
    rounds_count: 1,
    received_rejection: null,
    rejection_had_feedback: null,
    overall_score: null,
  })

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

  if (!user) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography>You must be signed in to leave a review.</Typography>
      <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Go back</Button>
    </Box>
  )

  const step0Valid = form.stage && form.application_date && form.last_interaction_date
  const step1Valid = form.received_acknowledgment !== null && form.communicated_timeline !== null && form.ghosted !== null && form.received_rejection !== null && (form.received_rejection === false || form.rejection_had_feedback !== null)
  const step2Valid = form.overall_score !== null

  const handleSubmit = async () => {
    setError(null)
    const { data: companyData } = await import('../services/supabase').then(({ supabase }) =>
      supabase.from('companies').select('id').eq('domain', domain).single()
    )
    const result = await submitReview({
      ...form,
      company_id: companyData.id,
      user_id: user.id,
      rejection_had_feedback: form.received_rejection ? form.rejection_had_feedback : false,
    })
    if (result.error) {
      setError(result.error.message)
      return
    }
    navigate(`/company/${domain}?submitted=true`)
  }

  return (
    <Box sx={{ p: 4, maxWidth: 640, mx: 'auto' }}>
      <Button onClick={() => navigate(`/company/${domain}`)} size="small" sx={{ mb: 3, color: 'text.secondary' }}>
        ← Back to {company?.name || domain}
      </Button>

      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
        Rate the hiring process
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {company?.name} — your experience helps others know what to expect
      </Typography>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {step === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>How far did you get?</Typography>
            <ToggleButtonGroup exclusive value={form.stage} onChange={(_e, v) => v && set('stage')(v)} fullWidth>
              {STAGES.map((s) => (
                <ToggleButton key={s.value} value={s.value} sx={{ flex: 1, fontSize: '0.75rem' }}>
                  {s.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <TextField
            label="Date you applied"
            type="date"
            value={form.application_date}
            onChange={(e) => set('application_date')(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />

          <TextField
            label="Date of last contact from company"
            type="date"
            value={form.last_interaction_date}
            onChange={(e) => set('last_interaction_date')(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
            helperText="If you never heard back, use your application date"
          />
        </Box>
      )}

      {step === 1 && (
        <Box>
          <YesNo label="Did they acknowledge receiving your application?" value={form.received_acknowledgment} onChange={set('received_acknowledgment')} />
          <Divider />
          <YesNo label="Did they communicate next steps or timelines?" value={form.communicated_timeline} onChange={set('communicated_timeline')} />
          <Divider />
          <YesNo label="Were you ghosted at any point?" value={form.ghosted} onChange={set('ghosted')} />
          <Divider />
          <YesNo label="Did you receive a formal rejection?" value={form.received_rejection} onChange={set('received_rejection')} />
          {form.received_rejection === true && (
            <>
              <Divider />
              <YesNo label="Did the rejection include real feedback?" value={form.rejection_had_feedback} onChange={set('rejection_had_feedback')} />
            </>
          )}
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
            <Typography variant="body2">How many interview rounds?</Typography>
            <ToggleButtonGroup exclusive value={form.rounds_count} onChange={(_e, v) => v && set('rounds_count')(v)} size="small">
              {[1, 2, 3, 4].map((n) => (
                <ToggleButton key={n} value={n} sx={{ px: 2 }}>{n === 4 ? '4+' : n}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
          <Typography variant="body1" fontWeight={600}>
            Overall hiring experience
          </Typography>
          <Rating
            value={form.overall_score}
            onChange={(_e, v) => set('overall_score')(v)}
            size="large"
            sx={{ fontSize: '3rem' }}
          />
          {form.overall_score && (
            <Typography variant="caption" color="text.secondary">
              {['', 'Very poor', 'Poor', 'Average', 'Good', 'Excellent'][form.overall_score]}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={() => step === 0 ? navigate(`/company/${domain}`) : setStep(step - 1)} disabled={isLoading}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < 2 ? (
          <Button
            variant="contained"
            onClick={() => setStep(step + 1)}
            disabled={step === 0 ? !step0Valid : !step1Valid}
          >
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit} disabled={!step2Valid || isLoading}>
            {isLoading ? <CircularProgress size={20} /> : 'Submit Review'}
          </Button>
        )}
      </Box>
    </Box>
  )
}
