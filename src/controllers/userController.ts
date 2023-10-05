import catchAsyncError from '@/middlewares/catchAsyncError'
import type User from '@/models/User'
import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import { type HttpResponse } from '@/types/HttpResponse'
import { type Response } from 'express'

export const getUserProfile = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  const resp: HttpResponse<User> = {
    status: 200,
    message: 'Fetched user successfully',
    data: req.user
  }
  res.send(resp)
})
