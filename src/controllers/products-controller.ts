import { NextFunction, Request, Response } from 'express'

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      // throw new Error(error.name)

      return res.json({ message: 'Ok!' })
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }
