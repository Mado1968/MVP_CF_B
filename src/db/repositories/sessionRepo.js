import { supabase } from '../supabaseClient.js'

export async function create(locale = 'ca') {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ locale })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateNode(id, currentNode, nodeHistory) {
  const { error } = await supabase
    .from('sessions')
    .update({ current_node: currentNode,
              node_history: nodeHistory,
              updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
export async function remove(id) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)
  if (error) throw error
}