import catchAsyncError from '@/middlewares/catchAsyncError'
import type User from '@/models/User'
import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import { type HttpResponse } from '@/types/HttpResponse'
import { type MailOption } from '@/types/MailOption'
import SendEmail from '@/utils/SendEmail'
import { randomNumberString } from '@/utils/random'
import { type Response } from 'express'
import { validationResult } from 'express-validator'
import { readFileSync } from 'fs'
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

  if (user.OTP === req.body.otp) {
    user.Password = md5(req.body.password)
    user.OTP = null
    await user.save()

    const resp: HttpResponse<null> = {
      status: 200,
      message: 'Đổi mật khẩu thành công.'
    }

    res.send(resp)
  } else {
    const resp: HttpResponse<null> = {
      status: 401,
      message: 'Sai mã OTP.'
    }

    res.send(resp)
  }
})

export const getOTP = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  const cDate = new Date()

  let isValid = true
  let timeDiff = 0

  if (req.user.OTPSentAt !== null) {
    timeDiff = Math.floor(Math.abs(req.user.OTPSentAt.getTime() - cDate.getTime()) / 1000)
    if (timeDiff < 60) {
      isValid = false
    }
  } else {
    isValid = true
  }

  if (!isValid) {
    const resp: HttpResponse<string> = {
      status: 429,
      message: 'Bạn phải đợi ' + (60 - timeDiff).toString() + ' giây để gửi lại mã OTP'
    }
    res.send(resp)
  } else {
    const OTP = randomNumberString(6)
    req.user.OTP = OTP
    req.user.OTPSentAt = cDate
    await req.user.save()

    const content = readFileSync('src/resource/send-otp-template.html', 'utf-8').replace('{{otp}}', OTP)

    const msg: MailOption = {
      email: req.user.Email,
      subject: 'Mã OTP từ ứng dụng HMA',
      msg: content
    }
    await SendEmail(msg)

    const resp: HttpResponse<string> = {
      status: 200,
      message: 'Get OTP Successfully'
    }
    res.send(resp)
  }
})
