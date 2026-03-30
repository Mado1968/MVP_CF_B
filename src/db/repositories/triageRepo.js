import { supabase } from '../supabaseClient.js'

export async function findBySession(sessionId) {
  const { data, error } = await supabase
    .from('triage_results')
    .select('*')
    .eq('session_id', sessionId)
    .single()
  if (error) throw error
  return data
}

export async function save(sessionId, triageData, dynamicData) {
  const { error } = await supabase
    .from('triage_results')
    .upsert({
      session_id:       sessionId,
      ...triageData,
      ...dynamicData,
      computed_at:      new Date().toISOString()
    })
  if (error) throw error
}