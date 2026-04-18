import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Stepper, Step, StepLabel,
  ToggleButtonGroup, ToggleButton, Rating, Alert,
  Divider, CircularProgress, Chip
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useGetCompanyByDomainQuery } from '../store/companiesApi'
import { useSubmitReviewMutation } from '../store/reviewsApi'
import { useAuth } from '../hooks/useAuth'

const STAGES = [
  { value: 'applied', label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'technical_interview', label: 'Technical Interview' },
  { value: 'take_home', label: 'Take Home Project' },
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

function DateField({ label, value, onChange, helperText }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Box
        component="input"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={new Date().toISOString().split('T')[0]}
        sx={{
          width: '100%',
          p: 1.75,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          fontSize: '1rem',
          outline: 'none',
          boxSizing: 'border-box',
          '&:focus': { borderColor: 'primary.main' },
          colorScheme: 'dark',
        }}
      />
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
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
  const [submitted, setSubmitted] = useState(false)
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

  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => navigate(`/company/${domain}`), 2000)
    return () => clearTimeout(t)
  }, [submitted, domain, navigate])

  if (submitted) return (
    <Box sx={{ p: 4, maxWidth: 640, mx: 'auto', textAlign: 'center', pt: 10 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Review submitted</Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Your review of {company?.name} is pending approval.
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
        Reviews are verified before going public to keep the data trustworthy.
        Scores appear once a company has 5 approved reviews.
      </Typography>
      <Button onClick={() => navigate(`/company/${domain}`)}>
        Back to {company?.name}
      </Button>
    </Box>
  )

  const step0Valid = form.stage && form.application_date && form.last_interaction_date
  const step1Valid = form.received_acknowledgment !== null
    && form.communicated_timeline !== null
    && form.ghosted !== null
    && form.received_rejection !== null
    && (form.received_rejection === false || form.rejection_had_feedback !== null)
  const step2Valid = form.overall_score !== null

  const handleSubmit = async () => {
    setError(null)
    const { supabase } = await import('../services/supabase')
    const { data: companyData } = await supabase.from('companies').select('id').eq('domain', domain).single()
    const result = await submitReview({
      ...form,
      company_id: companyData.id,
      user_id: user.id,
      rejection_had_feedback: form.received_rejection ? form.rejection_had_feedback : false,
    })
    if (result.error) {
      const msg = result.error.message || ''
      setError(
        msg.includes('reviews_user_id_company_id_key')
          ? "You've already submitted a review for this company."
          : msg
      )
      return
    }
    setSubmitted(true)
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 640, mx: 'auto' }}>
      <Button onClick={() => navigate(`/company/${domain}`)} size="small" sx={{ mb: 3, color: 'text.secondary' }}>
        ← Back to {company?.name || domain}
      </Button>

      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Rate the hiring process</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {company?.name} — your experience helps others know what to expect
      </Typography>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {step === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              How far did you get?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {STAGES.map((s) => (
                <Chip
                  key={s.value}
                  label={s.label}
                  onClick={() => set('stage')(s.value)}
                  variant={form.stage === s.value ? 'filled' : 'outlined'}
                  color={form.stage === s.value ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          <DateField
            label="Date you applied"
            value={form.application_date}
            onChange={set('application_date')}
          />

          <DateField
            label="Date of last contact from company"
            value={form.last_interaction_date}
            onChange={set('last_interaction_date')}
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
          <Typography variant="body1" fontWeight={600}>Overall hiring experience</Typography>
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
        <Button onClick={() => { setError(null); step === 0 ? navigate(`/company/${domain}`) : setStep(step - 1) }} disabled={isLoading}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < 2 ? (
          <Button variant="contained" onClick={() => { setError(null); setStep(step + 1) }} disabled={step === 0 ? !step0Valid : !step1Valid}>
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
