import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReviewCard from '../components/ReviewCard'

const baseReview = {
  id: '1',
  stage: 'applied',
  overall_score: 3,
  created_at: '2026-04-01T00:00:00Z',
  received_acknowledgment: true,
  communicated_timeline: false,
  ghosted: true,
  received_rejection: false,
  rounds_count: 1,
  moderation_status: 'approved',
}

describe('ReviewCard', () => {
  it('renders stage chip', () => {
    render(<ReviewCard review={baseReview} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('renders yes/no facts correctly', () => {
    render(<ReviewCard review={baseReview} />)
    expect(screen.getByText('Application acknowledged')).toBeInTheDocument()
    expect(screen.getByText('Communicated timeline')).toBeInTheDocument()
    expect(screen.getByText('Ghosted')).toBeInTheDocument()
  })

  it('does not show rejection feedback row when no rejection', () => {
    render(<ReviewCard review={{ ...baseReview, received_rejection: false }} />)
    expect(screen.queryByText('Rejection had feedback')).not.toBeInTheDocument()
  })

  it('shows rejection feedback row when rejection received', () => {
    render(<ReviewCard review={{ ...baseReview, received_rejection: true, rejection_had_feedback: true }} />)
    expect(screen.getByText('Rejection had feedback')).toBeInTheDocument()
  })

  it('shows pending badge when moderation_status is pending', () => {
    render(<ReviewCard review={{ ...baseReview, moderation_status: 'pending' }} />)
    expect(screen.getByText('Pending approval')).toBeInTheDocument()
  })

  it('does not show pending badge when approved', () => {
    render(<ReviewCard review={baseReview} />)
    expect(screen.queryByText('Pending approval')).not.toBeInTheDocument()
  })

  it('shows 4+ for rounds_count of 4', () => {
    render(<ReviewCard review={{ ...baseReview, rounds_count: 4 }} />)
    expect(screen.getByText('4+')).toBeInTheDocument()
  })

  it('shows numeric rounds count for values under 4', () => {
    render(<ReviewCard review={{ ...baseReview, rounds_count: 2 }} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
