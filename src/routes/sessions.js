import { Router } from 'express'
import * as sessionRepo from '../db/repositories/sessionRepo.js'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const { locale } = req.body
    const session = await sessionRepo.create(locale)
    res.json({
      session_id:   session.id,
      current_node: session.current_node
    })
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const session = await sessionRepo.findById(req.params.id)
    res.json(session)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await sessionRepo.remove(req.params.id)
    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router