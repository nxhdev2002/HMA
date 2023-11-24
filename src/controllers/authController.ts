import catchAsyncError from '@/middlewares/catchAsyncError'
import User from '@/models/User'
import { type HttpResponse } from '@/types/HttpResponse'
import ErrorHandler from '@/utils/ErrorHandler'
import { type NextFunction, type Request, type Response } from 'express'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import sequelize from '@/utils/dbConn'
import { randomString } from '@/utils/random'
import SendEmail from '@/utils/SendEmail'
import { type MailOption } from '@/types/MailOption'
import { validationResult } from 'express-validator/src/validation-result'
import { readFileSync } from 'fs'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'

interface UserRegisterResponse {
  user: User
  token: string
}

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    const message = errorMessages.join(', ')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resp: HttpResponse<null> = {
      status: 400,
      message
    }
    return res.status(400).json(resp)
  }
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
    id: user.Id
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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    // console.log(errors.array())
    const message = errorMessages.join(', ')
    // return res.status(400).json({ errors: errors.array() })
    const resp: HttpResponse<null> = {
      status: 400,
      message
    }

    return res.status(400).json(resp)
  }
  const { username, password } = req.body

  // check if email & password is correctly
  // if (username === null || password === null) {
  //   next(new ErrorHandler('Please enter email1', 400)); return
  // }

  const [user] = await sequelize.query('call HMA_AUTH_LOGIN(:username, :password, :type)', {
    replacements: {
      username,
      password: md5(password),
      type: 'NORMAL'
    }
  }) as unknown as [User, any]

  if (typeof user === 'undefined') {
    next(new ErrorHandler('Invalid email or password', 401)); return
  }

  if (user.IsDeleted === 1) next(new ErrorHandler('Người dùng đã bị khoá.', 403))

  const token = jwt.sign({
    id: user.Id
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, process.env.JWT_SECRET!)

  res.status(200).json({
    status: 200,
    message: 'User login successfully',
    data: {
      user,
      token
    }
  })
})

export const loginUserWithGoogle = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const client = new OAuth2Client()
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  const payload: TokenPayload | undefined = ticket.getPayload()
  if (typeof (payload) === 'undefined') {
    res.status(500).json({
      status: 500,
      message: 'Server error'
    })
  } else {
    const [user] = await sequelize.query('call HMA_AUTH_LOGIN(:username, :password, :type)', {
      replacements: {
        username: payload.email,
        password: null,
        type: 'GOOGLE'
      }
    }) as unknown as [User, any]

    if (user.IsDeleted === 1) next(new ErrorHandler('Người dùng đã bị khoá.', 403))

    if (typeof user === 'undefined') {
      const hashedPwd = md5(randomString(20))
      const user = await User.create({
        Username: payload.email,
        Password: hashedPwd,
        FullName: payload.name,
        Email: payload.email
      })

      const token = jwt.sign({
        id: user.Id
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      }, process.env.JWT_SECRET!)
      res.status(201).json({
        status: 201,
        message: 'User login successfully',
        data: {
          user,
          token
        }
      })
      return
    }

    /// update user info
    await sequelize.query('call HMA_AUTH_USER_UPDATE(:p_user_id, :p_avatar, :p_background, :p_fullname, :p_birthday, :p_gender)', {
      replacements: {
        p_user_id: user.Id,
        p_avatar: payload.picture,
        p_background: null,
        p_fullname: payload.name,
        p_birthday: null,
        p_gender: null
      }
    })
    const token = jwt.sign({
      id: user.Id
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    }, process.env.JWT_SECRET!)
    res.status(200).json({
      status: 200,
      message: 'User login successfully',
      data: {
        user,
        token
      }
    })
  }
})

export const forgotPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body

  const newpwd = randomString(8)

  await sequelize.query('call HMA_AUTH_RESET_PASSWORD(:email, :newpwd)', {
    replacements: {
      email,
      newpwd: md5(newpwd)
    }
  })

  const content = readFileSync('src/resource/reset-password-template.html', 'utf-8').replace('{{newpwd}}', newpwd)

  const msg: MailOption = {
    email,
    subject: 'Reset mật khẩu người dùng',
    msg: content
  }
  await SendEmail(msg)

  const resp: HttpResponse<null> = {
    status: 200,
    message: 'Reset password successfully'
  }
  res.status(200).send(resp)
})
