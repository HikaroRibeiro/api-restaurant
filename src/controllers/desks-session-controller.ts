import { Request, Response, NextFunction } from 'express'
import { knex } from '@/database/knex'
import { number, z } from 'zod'
import { AppError } from '@/utils/app-error'

class DesksSessionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        desk_id: number(),
      })

      const { desk_id } = bodySchema.parse(req.body)

      const sessionOpened = await knex<DesksSessionRepository>('desks_session')
        .select()
        .where({ desk_id })
        .orderBy('opened_at', 'desc')
        .first()

      // return res.json({ sessionOpened })

      if (sessionOpened && !sessionOpened.closed_at) {
        throw new AppError(`The desk with id ${desk_id} has already opened!`)
      }

      await knex<DesksSessionRepository>('desks_session').insert({
        desk_id,
        opened_at: knex.raw("datetime('now', 'localtime')"),
      })

      return res
        .status(201)
        .json({ message: `Objeto ${desk_id} criado com sucesso.` })
    } catch (error) {
      next(error)
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const desksSessions = await knex<DesksSessionRepository>('desks_session')
        .select(
          'desks_session.id',
          'desks_session.desk_id',
          'desks.table_number',
          'desks_session.opened_at',
          'desks_session.closed_at',
        )
        .join('desks', 'desks.id', 'desks_session.desk_id')
        .orderBy('closed_at')
      return res.status(201).json(desksSessions)
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

      const deskSession = await knex<DesksSessionRepository>('desks_session')
        .select()
        .where({ id })
        .first()

      if (!deskSession) {
        throw new AppError('Session desk was not found!')
      }

      if (deskSession.closed_at) {
        throw new AppError('This session has already closed!')
      }

      await knex<DesksSessionRepository>('desks_session')
        .update({
          closed_at: knex.raw("datetime('now', 'localtime')"),
        })
        .where({ id })

      res.json({ message: `Produto com o Id: ${id} atualizado com sucesso.` })
    } catch (error) {
      next(error)
    }
  }
}

export { DesksSessionController }
