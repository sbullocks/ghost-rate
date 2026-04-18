import { describe, it, expect } from 'vitest'

const GHOST_THRESHOLDS = {
  applied: 14,
  phone_screen: 10,
  final_round: 14,
  offer: 7,
}

function validateGhostThreshold(stage, lastInteractionDate, ghosted) {
  if (!ghosted) return null
  const threshold = GHOST_THRESHOLDS[stage]
  if (!threshold) return null
  const daysSince = Math.floor(
    (new Date() - new Date(lastInteractionDate)) / (1000 * 60 * 60 * 24)
  )
  if (daysSince < threshold) {
    return `You must wait ${threshold} days after last contact before marking as ghosted. ${threshold - daysSince} day(s) remaining.`
  }
  return null
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

describe('ghost threshold validation', () => {
  it('returns null when ghosted is false', () => {
    expect(validateGhostThreshold('applied', daysAgo(1), false)).toBeNull()
  })

  it('returns null for stages without a threshold', () => {
    expect(validateGhostThreshold('technical_interview', daysAgo(1), true)).toBeNull()
    expect(validateGhostThreshold('take_home', daysAgo(1), true)).toBeNull()
  })

  it('blocks applied ghosted before 14 days', () => {
    const msg = validateGhostThreshold('applied', daysAgo(10), true)
    expect(msg).toMatch(/14 days/)
    expect(msg).toMatch(/4 day\(s\) remaining/)
  })

  it('allows applied ghosted at exactly 14 days', () => {
    expect(validateGhostThreshold('applied', daysAgo(14), true)).toBeNull()
  })

  it('allows applied ghosted after 14 days', () => {
    expect(validateGhostThreshold('applied', daysAgo(20), true)).toBeNull()
  })

  it('blocks phone_screen ghosted before 10 days', () => {
    const msg = validateGhostThreshold('phone_screen', daysAgo(5), true)
    expect(msg).toMatch(/10 days/)
    expect(msg).toMatch(/5 day\(s\) remaining/)
  })

  it('allows phone_screen ghosted at exactly 10 days', () => {
    expect(validateGhostThreshold('phone_screen', daysAgo(10), true)).toBeNull()
  })

  it('blocks offer ghosted before 7 days', () => {
    const msg = validateGhostThreshold('offer', daysAgo(3), true)
    expect(msg).toMatch(/7 days/)
  })

  it('allows offer ghosted at exactly 7 days', () => {
    expect(validateGhostThreshold('offer', daysAgo(7), true)).toBeNull()
  })

  it('blocks final_round ghosted before 14 days', () => {
    const msg = validateGhostThreshold('final_round', daysAgo(13), true)
    expect(msg).toMatch(/14 days/)
    expect(msg).toMatch(/1 day\(s\) remaining/)
  })
})
