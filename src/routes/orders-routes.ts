import { Router } from 'express'
import { OrdersController } from '@/controllers/orders-controllers'

const orderRouter = Router()
const ordersController = new OrdersController()

orderRouter.post('/', ordersController.create)
orderRouter.get('/desk-session/:id/total', ordersController.show)
orderRouter.get('/desk-session/:id', ordersController.index)

export { orderRouter }
