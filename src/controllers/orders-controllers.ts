import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { knex } from '@/database/knex'
import { AppError } from '@/utils/app-error'

class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        desks_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      })

      const { desks_session_id, product_id, quantity } = bodySchema.parse(
        req.body,
      )
      const product = await knex<ProductRepository>('products')
        .select()
        .where({ id: product_id })
        .first()

      const sessions = await knex<DesksSessionRepository>('desks_session')
        .select()
        .where({ id: desks_session_id })
        .first()

      if (!product) {
        throw new AppError('Product not found!')
      }

      if (!sessions) {
        throw new AppError('Session was not opened yet or not found!')
      }

      if (sessions.closed_at) {
        throw new AppError('Desk is closed now')
      }

      await knex<OrdersRepository>('orders').insert({
        desks_session_id,
        product_id,
        quantity,
        price: product.price,
      })

      return res.status(201).json({
        desks_session_id,
        product_id,
        quantity,
        price: product?.price,
        name_product: product.name,
      })
    } catch (error) {
      next(error)
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const desks_session_id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'Id must be a number.' })
        .parse(req.params.id)

      const orders = await knex('orders')
        .select(
          'orders.id',
          'orders.desks_session_id',
          'orders.product_id',
          'products.name',
          'orders.quantity',
          'orders.price',
          knex.raw('(orders.quantity * orders.price) AS total'),
          'orders.created_at',
          'orders.updated_at',
        )
        .join('products', 'products.id', 'orders.product_id')
        .where({ desks_session_id })
        .orderBy('orders.created_at', 'desc')

      if (orders.length <= 0) {
        return res
          .status(403)
          .json({ message: 'There is no orders to this session desk.' })
      }

      return res.json({ orders })
    } catch (error) {
      next(error)
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const desks_session_id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: 'Id must be a number.' })
        .parse(req.params.id)

      const desk_total = await knex('orders')
        .select(
          'desks_session_id',
          knex.raw('COALESCE(SUM(orders.price * orders.quantity),0) AS total'),
          knex.raw('COALESCE(SUM(orders.quantity),0) AS quantity'),
        )
        .where({ desks_session_id })
        .first()

      return res.status(201).json(desk_total)
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersController }
