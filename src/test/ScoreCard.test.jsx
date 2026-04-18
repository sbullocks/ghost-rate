import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreCard from '../components/ScoreCard'

describe('ScoreCard', () => {
  it('shows pending message when data is null', () => {
    render(<ScoreCard data={null} />)
    expect(screen.getByText(/Score summary unlocks after 5 reviews/)).toBeInTheDocument()
  })

  it('shows pending message when review_count is undefined', () => {
    render(<ScoreCard data={{ avg_score: 4.2 }} />)
    expect(screen.getByText(/Score summary unlocks after 5 reviews/)).toBeInTheDocument()
  })

  it('shows pending message when review_count is 0', () => {
    render(<ScoreCard data={{ review_count: 0 }} />)
    expect(screen.getByText(/Score summary unlocks after 5 reviews/)).toBeInTheDocument()
  })

  it('shows pending message when review_count is less than 5', () => {
    render(<ScoreCard data={{ review_count: 4 }} />)
    expect(screen.getByText(/Score summary unlocks after 5 reviews/)).toBeInTheDocument()
  })

  it('shows scores when review_count is exactly 5', () => {
    render(<ScoreCard data={{ review_count: 5, avg_score: 3.5, ghost_rate: 20, acknowledgment_rate: 80, feedback_rate: 60 }} />)
    expect(screen.getByText('3.5 / 5')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
    expect(screen.getByText('5 reviews')).toBeInTheDocument()
  })

  it('shows scores when review_count is above 5', () => {
    render(<ScoreCard data={{ review_count: 12, avg_score: 4.0, ghost_rate: 50, acknowledgment_rate: 75, feedback_rate: 33 }} />)
    expect(screen.getByText('4 / 5')).toBeInTheDocument()
    expect(screen.getByText('12 reviews')).toBeInTheDocument()
  })
})
