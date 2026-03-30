// src/server.js
import app from './app.js'
import { config } from './config/index.js'

app.listen(config.port, () => {
  console.log(`API running on port ${config.port}`)
})