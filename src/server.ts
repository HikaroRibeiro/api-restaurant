import 'dotenv/config'
import express from 'express'
import { routes } from './routes'

const PORT = process.env.PORT
const server = express()

server.use(express.json())
server.use(routes)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
