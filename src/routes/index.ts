import { Router } from 'express'
import { productsRouter } from './products-routes'
import { deskRouter } from './desks-routes'

const routes = Router()

routes.use('/products', productsRouter)
routes.use('/desks', deskRouter)

export { routes }
