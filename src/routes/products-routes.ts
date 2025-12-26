import { ProductController } from '@/controllers/products-controller'
import { Router } from 'express'

const productsRouter = Router()
const productController = new ProductController()

productsRouter.get('/', productController.index)

export { productsRouter }
