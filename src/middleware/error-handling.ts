/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppError } from '@/utils/app-error'
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export default function errorHandling(
  error: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.code).json({ message: error.message })
  }

  if (error instanceof ZodError) {
    return res.status(400)
    .json({message: 'Validation Erros', issues: error.format()})
  }

  return res.status(500).json({ message: error.message })
}
