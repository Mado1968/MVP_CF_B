export function computeProposal(triage) {
  const { dynamic_phase, min_willingness,
          primary_factor, frequency } = triage

  if (!min_willingness) return { route: 'B', alt: 'C' }
  if (frequency === 'cronic') return { route: 'C', alt: 'A' }
  if (dynamic_phase === 'encallat') return { route: 'C', alt: 'B' }

  return { route: 'A', alt: 'C' }
}