import { NextFunction, Request, Response } from 'express'
import { number, string, z } from 'zod'
import { knex } from '@/database/knex'
import { AppError } from '@/utils/app-error'

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      // throw new Error(error.name)
      const { name } = req.query

      const products = await knex<ProductRepository>('products')
        .select('*')
        .whereLike('name', `%${name ?? ''}%`)
        .orderBy('name')

      // return res.json(products[0].name)

      return res.json(products)
    } catch (error) {
      next(error)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'Id must be a number.' })
        .parse(req.params.id)

      const products = await knex<ProductRepository>('products')
        .select('*')
        .whereLike('id', `${id ?? ''}`)

      if (products.length <= 0) {
        throw new AppError('Product not found')
      }

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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'Id must be a number.' })
        .parse(req.params.id)

      const bodySchema = z.object({
        name: string().trim().min(6),
        price: number().gt(0),
      })

      const { name, price } = bodySchema.parse(req.body)

      await knex<ProductRepository>('products')
        .update({
          name,
          price,
          updated_at: knex.raw("datetime('now', 'localtime')"),
        })
        .where({ id })

      res.json({ message: `Produto com o Id: ${id} atualizado com sucesso.` })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'Id must be a number.' })
        .parse(req.params.id)

      const products = await knex<ProductRepository>('products')
        .select()
        .where({ id })
        .first()

      if (!products) {
        throw new AppError('Product not found')
      }

      await knex('products').delete().where({ id })
      return res.json()
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }
