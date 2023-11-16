import catchAsyncError from '@/middlewares/catchAsyncError'
import User from '@/models/User'
import { type HttpResponse } from '@/types/HttpResponse'
import ErrorHandler from '@/utils/ErrorHandler'
import { type NextFunction, type Request, type Response } from 'express'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import sequelize from '@/utils/dbConn'
interface UserRegisterResponse {
  user: User
  token: string
}

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, name, birthday, gender } = req.body

  const hashedPwd = md5(password)
  const user = await User.create({
    Username: username,
    Password: hashedPwd,
    FullName: name,
    Email: email,
    Birthday: birthday,
    Gender: gender
  })

  const token = jwt.sign({
    id: user.id
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, process.env.JWT_SECRET!)
  const resp: HttpResponse<UserRegisterResponse> = {
    status: 201,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  }

  res.status(201).send(resp)
})

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  // check if email & password is correctly
  if (username === null || password === null) {
    next(new ErrorHandler('Please enter email & password', 400)); return
  }

  const [user, _] = await sequelize.query('call HMA_AUTH_LOGIN(:username, :password)', {
    replacements: {
      username,
      password: md5(password)
    }
  }) as unknown as [User, any]

  if (typeof user === 'undefined') {
    next(new ErrorHandler('Invalid email or password', 401)); return
  }

  const token = jwt.sign({
    id: user.id
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, process.env.JWT_SECRET!)

  res.status(200).json({
    success: true,
    token,
    user
  })
})
