/*import { supabase } from '../supabaseClient.js'

export async function saveResponse(sessionId, nodeId,
                                   questionId, answer) {
  const { error } = await supabase
    .from('flow_responses')
    .insert({ session_id: sessionId, node_id: nodeId,
              question_id: questionId, ...answer })
  if (error) throw error
}

export async function getAnswersForNode(sessionId, nodeId) {
  const { data, error } = await supabase
    .from('flow_responses')
    .select('*')
    .eq('session_id', sessionId)
    .eq('node_id', nodeId)
  if (error) throw error
  return data
}

export async function getAllAnswers(sessionId) {
  const { data, error } = await supabase
    .from('flow_responses')
    .select('*')
    .eq('session_id', sessionId)
    .order('answered_at')
  if (error) throw error
  return data
}
  */
 import { supabase } from '../supabaseClient.js'

export async function saveResponse(sessionId, nodeId, questionId, answer) {
  const { error } = await supabase
    .from('flow_responses')
    .insert({
      session_id:  sessionId,
      node_id:     nodeId,
      question_id: questionId,
      score:       answer.score  ?? null,
      choice:      answer.choice ?? null,
    })
  if (error) throw error
}

export async function getAnswersForNode(sessionId, nodeId) {
  const { data, error } = await supabase
    .from('flow_responses')
    .select('*')
    .eq('session_id', sessionId)
    .eq('node_id', nodeId)
  if (error) throw error
  return data
}

export async function getAllAnswers(sessionId) {
  const { data, error } = await supabase
    .from('flow_responses')
    .select('*')
    .eq('session_id', sessionId)
    .order('answered_at')
  if (error) throw error
  return data
}