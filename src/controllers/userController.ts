import catchAsyncError from '@/middlewares/catchAsyncError'
import type User from '@/models/User'
import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import { type HttpResponse } from '@/types/HttpResponse'
import { type Response } from 'express'
import { validationResult } from 'express-validator'
import md5 from 'md5'

export const getUserProfile = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  const resp: HttpResponse<User> = {
    status: 200,
    message: 'Fetched user successfully',
    data: req.user
  }
  res.send(resp)
})

export const changeUserPassword = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    const message = errorMessages.join(', ')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resp: HttpResponse<null> = {
      status: 400,
      message
    }
    res.status(400).json(resp)
    return
  }

  const user = req.user
  user.Password = md5(req.body.password)
  await user.save()

  const resp: HttpResponse<null> = {
    status: 200,
    message: 'Changed password successfully'
  }

  res.send(resp)
})
