import { NODE_MAP } from './nodeMap.js'
import * as sessionRepo  from '../db/repositories/sessionRepo.js'
import * as flowRepo     from '../db/repositories/flowRepo.js'
import * as triageEngine from './triageEngine.js'          // ← AFEGEIX

export async function getNextCard(sessionId) {
  const session = await sessionRepo.findById(sessionId)
  const nodeDef = NODE_MAP[session.current_node]

  if (!nodeDef) {
    return { node: session.current_node, done: true }
  }

  return {
    node:      session.current_node,
    questions: nodeDef.questions,
    history:   session.node_history
  }
}

export async function processAnswer(sessionId, questionId, answer) {
  const session = await sessionRepo.findById(sessionId)
  const nodeId  = session.current_node
  const nodeDef = NODE_MAP[nodeId]

  if (!nodeDef) throw new Error(`Node desconegut: ${nodeId}`)

  await flowRepo.saveResponse(sessionId, nodeId, questionId, answer)

  const allAnswers  = await flowRepo.getAnswersForNode(sessionId, nodeId)
  const allAnswered = nodeDef.questions
    .filter(q => !q.conditional || q.conditional(allAnswers))
    .every(q => allAnswers.find(a => a.question_id === q.id))

  if (!allAnswered) {
    return { nextNode: nodeId, nodeComplete: false }
  }

  const nextNode = nodeDef.next(allAnswers)
  const history  = [...(session.node_history || []), nodeId]
  await sessionRepo.updateNode(sessionId, nextNode, history)

  // ── INICI BLOC TRIATGE ──────────────────────────────────────────
  // S'executa quan node_3b acaba i el flux avança cap a node_4.
  // Recull totes les respostes, calcula els factors i els guarda.
  if (nodeId === 'node_3b' && nextNode === 'node_4') {
    const allFlowAnswers = await flowRepo.getAllAnswers(sessionId)

    // Factors del triatge (respostes del node_3a)
    const answers3a     = allFlowAnswers.filter(a => a.node_id === 'node_3a')
    const triageFactors = triageEngine.computeFactors(answers3a)

    // Perfil dinàmic (respostes del node_3b)
    const answers3b = allFlowAnswers.filter(a => a.node_id === 'node_3b')
    const dynamic   = {
      dynamic_phase:   answers3b.find(a => a.question_id === 'q3b_phase')?.choice   ?? null,
      dynamic_pattern: answers3b.find(a => a.question_id === 'q3b_pattern')?.choice ?? null,
      frequency:       answers3b.find(a => a.question_id === 'q3b_freq')?.choice    ?? null,
      min_willingness: answers3b.find(a => a.question_id === 'q3b_will')?.choice === 'si',
    }

    await triageEngine.saveTriage(sessionId, triageFactors, dynamic)
  }
  // ── FI BLOC TRIATGE ─────────────────────────────────────────────

  return { nextNode, nodeComplete: true }
}