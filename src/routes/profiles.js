import { Router } from 'express'
const router = Router()

router.post('/',       (req, res) => res.json({ ok: true, stub: 'POST /sessions' }))
router.get('/:id',    (req, res) => res.json({ ok: true, stub: 'GET /sessions/:id' }))
router.delete('/:id', (req, res) => res.json({ ok: true, stub: 'DELETE /sessions/:id' }))

export default router