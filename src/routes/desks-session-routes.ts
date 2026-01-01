import { DesksSessionController } from '@/controllers/desks-session-controller'
import { Router } from 'express'

const desksSessionRouter = Router()
const desksSessionController = new DesksSessionController()

desksSessionRouter.get('/', desksSessionController.index)
desksSessionRouter.post('/', desksSessionController.create)
desksSessionRouter.patch('/:id', desksSessionController.update)

export { desksSessionRouter }
