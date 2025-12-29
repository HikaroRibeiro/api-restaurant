import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { knex } from '@/database/knex'

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      // throw new Error(error.name)
      const products = await knex<ProductRepository>('products').select('*')

      // return res.json(products[0].name)

      return res.json(products)
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0),
      })

      const { name, price } = bodySchema.parse(req.body)

      await knex<ProductRepository>('products').insert({ name, price })

      return res.status(201).json()
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }
