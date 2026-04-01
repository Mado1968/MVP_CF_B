// src/app.js
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { config } from './config/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import sessionsRoutes from './routes/sessions.js'
import flowRoutes     from './routes/flow.js'
import profilesRoutes from './routes/profiles.js'
import safetyRoutes   from './routes/safety.js'

const app = express()
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(cors())
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/api/sessions', sessionsRoutes)
app.use('/api/flow',     flowRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/safety',   safetyRoutes)

app.use(errorHandler)
export default app