import catchAsyncError from '@/middlewares/catchAsyncError'
import User from '@/models/User'
import { type HttpResponse } from '@/types/HttpResponse'
import ErrorHandler from '@/utils/ErrorHandler'
import { type NextFunction, type Request, type Response } from 'express'

interface UserRegisterResponse {
  user: User
  token: string
}

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, name, birthday, gender } = req.body

  const user = await User.create({
    username,
    password,
    fullName: name,
    email,
    birthday,
    gender
  })

  const token = user.getJwtToken()
  const resp: HttpResponse<UserRegisterResponse> = {
    status: 201,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  }

  res.send(resp)
})

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  // check if email & password is correctly
  if (username === null || password === null) {
    next(new ErrorHandler('Please enter email & password', 400))
  }

  const user = await User.findOne({
    where:
      {
        username
      }
  })
  if (user === null) {
    next(new ErrorHandler('Invalid email or password', 401)); return
  }

  const isMatched: boolean = await user.comparePassword(password)
  if (!isMatched) {
    next(new ErrorHandler('Invalid email or password', 401))
  }

  const token = user.getJwtToken()
  res.status(200).json({
    success: true,
    token,
    user
  })
})
