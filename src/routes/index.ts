import { Router } from 'express'
import { productsRouter } from './products-routes'
import { deskRouter } from './desks-routes'
import { desksSessionRouter } from './desks-session-routes'
import { orderRouter } from './orders-routes'

const routes = Router()

routes.use('/products', productsRouter)
routes.use('/desks', deskRouter)
routes.use('/desks-session', desksSessionRouter)
routes.use('/orders', orderRouter)

export { routes }
