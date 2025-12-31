import { knex } from '@/database/knex'
import { Request, Response, NextFunction } from 'express'
import { number, z } from 'zod'

export default class DesksController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_number: number().gt(0),
      })

      const { table_number } = bodySchema.parse(req.body)

      await knex<DesksRepository>('desks').insert({ table_number })
      return res.json()
    } catch (error) {
      next(error)
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const desks = await knex<DesksRepository>('Desks')
        .select()
        .orderBy('table_number')
      return res.status(200).json(desks)
    } catch (error) {
      next(error)
    }
  }
}
