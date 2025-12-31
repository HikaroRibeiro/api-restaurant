import { ProductController } from '@/controllers/products-controller'
import { Router } from 'express'

const productsRouter = Router()
const productController = new ProductController()

productsRouter.get('/', productController.index)
productsRouter.get('/:id', productController.list)

productsRouter.post('/', productController.create)

productsRouter.put('/:id', productController.update)

productsRouter.delete('/:id', productController.delete)

export { productsRouter }
