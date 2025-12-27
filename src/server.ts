import 'dotenv/config'
import express from 'express'
import { routes } from './routes'
import errorHandling from './middleware/error-handling'

const PORT = process.env.PORT
const server = express()

server.use(express.json())
server.use(routes)
server.use(errorHandling)

console.log(
  `Connection file: ${process.env.DATABASE_PATH}, Client database: ${process.env.CLIENT_DATABASE}`,
)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
