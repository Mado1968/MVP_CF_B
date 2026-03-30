import { supabase } from '../db/supabaseClient.js'

export async function flagSession(sessionId, nodeTriggered, flagType) {
  await supabase.from('safety_flags').insert({
    session_id:     sessionId,
    node_triggered: nodeTriggered,
    flag_type:      flagType
  })
  await supabase
    .from('sessions')
    .update({
      current_node: 'route_d',
      status:       'safety_exit'
    })
    .eq('id', sessionId)
}

export function getResources(locale) {
  const resources = {
    ca: [
      { name: '016',      desc: 'Violència de gènere',   tel: '016' },
      { name: 'SOS Dona', desc: 'Suport i assessorament', url: 'https://sosdona.cat' },
      { name: '112',      desc: 'Emergències',            tel: '112' }
    ],
    es: [
      { name: '016', desc: 'Violencia de género', tel: '016' },
      { name: '112', desc: 'Emergencias',         tel: '112' }
    ],
    en: [
      { name: '112', desc: 'Emergency services', tel: '112' }
    ]
  }
  return resources[locale] ?? resources['ca']
}