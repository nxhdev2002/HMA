import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import { type HttpResponse } from '@/types/HttpResponse'
import type ErrorHandler from '@/utils/ErrorHandler'
import logger from '@/utils/logger'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { error } from 'console'
import { type NextFunction, type Response } from 'express'

export = (err: ErrorHandler | any, req: GetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  console.log(err)
  if (err.statusCode === null || typeof (err.statusCode) === 'undefined') {
    err.statusCode = 500
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  // try {
  //   err.statusCode = err.errors == null ? err.errors[0].original.statusCode : err.statusCode
  // } catch {
  // }
  logger.error(req.user?.Id + err.message)
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
