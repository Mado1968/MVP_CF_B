const FACTOR_PAIRS = {
  interpretacio:  ['q3a_01','q3a_02'],
  temps:          ['q3a_03','q3a_04'],
  seguretat:      ['q3a_05','q3a_06'],
  responsabilitat:['q3a_07','q3a_08'],
  proximitat:     ['q3a_09','q3a_10'],
  influencia:     ['q3a_11','q3a_12'],
  recursos:       ['q3a_13','q3a_14'],
  direccio:       ['q3a_15','q3a_16'],
}

export function computeFactors(answers) {
  const scores = {}
  for (const [factor, [q1, q2]] of Object.entries(FACTOR_PAIRS)) {
    const s1 = answers.find(a=>a.question_id===q1)?.score ?? 0
    const s2 = answers.find(a=>a.question_id===q2)?.score ?? 0
    scores[factor] = s1 + s2
  }
  const sorted = Object.entries(scores)
    .sort(([,a],[,b]) => b - a)
  const [primary]   = sorted[0]
  const [secondary] = sorted[1]
  const gap = sorted[0][1] - sorted[1][1]
  return {
    primary_factor:    primary,
    secondary_factor:  secondary,
    context_factors:   scores,
    needs_refinement:  gap < 2   // activa node_3a1
  }
}

export async function saveTriage(sessionId, triageData,
                                  node3bData) {
  const { error } = await supabase
    .from('triage_results')
    .upsert({ session_id: sessionId, ...triageData,
              ...node3bData })
  if (error) throw error
}