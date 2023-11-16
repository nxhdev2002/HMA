import { type HttpResponse } from '@/types/HttpResponse'
import type ErrorHandler from '@/utils/ErrorHandler'
import { type NextFunction, type Request, type Response } from 'express'

export = (err: ErrorHandler | any, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  // try {
  //   err.statusCode = err.errors == null ? err.errors[0].original.statusCode : err.statusCode
  // } catch {
  // }

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    const resp: HttpResponse<string> = {
      status: err.statusCode,
      message: err.message,
      data: err.stack
    }

    res.status(err.statusCode).json(resp)
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    const resp: HttpResponse<null> = {
      status: err.statusCode,
      message: err.message
    }

    res.status(err.statusCode).json(resp)
  }
}
