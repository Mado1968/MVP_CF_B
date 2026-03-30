/*import { Router } from 'express'
const router = Router()

router.get('/:session_id/next', async (req, res, next) => {
  try {
    const card = await flowEngine.getNextCard(
      req.params.session_id
    )
    res.json(card)
  } catch(e) { next(e) }
})

router.post('/:session_id/answer', async (req, res, next) => {
  try {
    const { question_id, score, choice } = req.body
    const result = await flowEngine.processAnswer(
      req.params.session_id, question_id,
      { score, choice }
    )
    res.json(result)
  } catch(e) { next(e) }
})

//router.post('/',       (req, res) => res.json({ ok: true, stub: 'POST /sessions' }))
//router.get('/:id',    (req, res) => res.json({ ok: true, stub: 'GET /sessions/:id' }))
router.delete('/:id', (req, res) => res.json({ ok: true, stub: 'DELETE /sessions/:id' }))

export default router

*/

import { Router } from 'express'
import * as flowEngine from '../services/flowEngine.js'
import * as triageRepo      from '../db/repositories/triageRepo.js'
import * as sessionRepo     from '../db/repositories/sessionRepo.js'
import * as proposalService from '../services/proposalService.js'
import { supabase }         from '../db/supabaseClient.js'


const router = Router()

router.get('/:session_id/next', async (req, res, next) => {
  try {
    const card = await flowEngine.getNextCard(req.params.session_id)
    res.json(card)
  } catch (e) { next(e) }
})

router.post('/:session_id/answer', async (req, res, next) => {
  try {
    const { question_id, score, choice } = req.body
    const result = await flowEngine.processAnswer(
      req.params.session_id,
      question_id,
      { score, choice }
    )
    res.json(result)
  } catch (e) { next(e) }
})
router.get('/:session_id/summary', async (req, res, next) => {
  try {
    const triage = await triageRepo.findBySession(
      req.params.session_id
    )
    res.json({ triage })  // el front renderitza la SummaryCard
  } catch(e) { next(e) }
})

router.post('/:sid/confirm', async (req,res,next) => {
  try {
    const result = await flowEngine.processAnswer(
      req.params.sid, 'q4_confirm',
      { choice: req.body.confirmed ? 'yes' : 'no' }
    )
    res.json(result)
  } catch(e) { next(e) }
})

router.post('/:sid/proposal', async (req,res,next) => {
  try {
    const triage = await triageRepo.findBySession(req.params.sid)
    const proposal = proposalService.computeProposal(triage)
    await supabase.from('route_proposals').insert({
      session_id:    req.params.sid,
      proposed_route: proposal.route,
      alt_route:      proposal.alt,
      node6_answer:   req.body.node6_answer
    })
    const result = await flowEngine.processAnswer(
      req.params.sid, 'q6_need',
      { choice: req.body.node6_answer }
    )
    res.json({ ...result, proposal })
  } catch(e) { next(e) }
})

router.post('/:sid/close', async (req, res, next) => {
  try {
    const { what_helped, early_signal, micro_habit } = req.body
    await supabase.from('conflict_profiles').insert({
      session_id: req.params.sid,
      what_helped, early_signal, micro_habit
    })
    await sessionRepo.updateNode(req.params.sid, 'done', [])
    await supabase.from('sessions')
      .update({ status: 'completed' })
      .eq('id', req.params.sid)
    res.json({ ok: true })
  } catch(e) { next(e) }
})
router.post('/:sid/checkin', async (req, res, next) => {
  try {
    const { has_helped, tension_increased, activation_level } = req.body

    // Guarda el checkin a la base de dades
    await supabase.from('checkins').insert({
      session_id:        req.params.sid,
      has_helped,
      tension_increased,
      activation_level,
    })

    // Determina el següent node segons les respostes
    let outcome
    if (tension_increased || activation_level >= 8) {
      outcome = 'node_2'
    } else if (!has_helped) {
      outcome = 'node_6'
    } else {
      outcome = 'node_8'
    }

    // Actualitza el node a la sessió
    await sessionRepo.updateNode(req.params.sid, outcome, [])

    res.json({ ok: true, nextNode: outcome })
  } catch (e) { next(e) }
})


export default router