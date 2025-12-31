import DesksController from '@/controllers/desks-controller'
import { Router } from 'express'

const deskRouter = Router()
const desksController = new DesksController()

deskRouter.post('/', desksController.create)
deskRouter.get('/', desksController.index)

export { deskRouter }
