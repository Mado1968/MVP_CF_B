import { Router }        from 'express'
import * as safetyService from '../services/safetyService.js'

const router = Router()

router.get('/resources/:locale', (req, res) => {
  const resources = safetyService.getResources(req.params.locale)
  res.json({ resources })
})

router.post('/flag', async (req, res, next) => {
  try {
    const { session_id, node_triggered, flag_type } = req.body
    await safetyService.flagSession(session_id, node_triggered, flag_type)
    res.json({ ok: true, redirect: '/safety' })
  } catch (e) { next(e) }
})

router.post('/exit', (req, res) => {
  res.json({ ok: true })
})

export default router