import catchAsyncError from '@/middlewares/catchAsyncError'
import User from '@/models/User'
import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import ErrorHandler from '@/utils/ErrorHandler'
import { type Response, type NextFunction } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export const isAuthenticatedUser = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  let bearerToken = ''
  const bearerHeader = req.headers.authorization

  if (typeof bearerHeader !== 'undefined') {
    bearerToken = bearerHeader.split(' ')[1]
  }

  if (bearerToken.length === 0) {
    next(
      new ErrorHandler('Bạn phải đăng nhập để truy cập tài nguyên này', 401)
    ); return
  }
  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as JwtPayload
    const user = await User.findByPk(decoded.id)

    if (typeof user === 'undefined' || user === null) {
      next(
        new ErrorHandler('Thông tin xác thực không chính xác, vui lòng đăng nhập lại.', 403)
      ); return
    }
    if (user.IsDeleted === 1) {
      next(
        new ErrorHandler('Người dùng đã bị khoá.', 403)
      )
    }
    req.user = user
    next()
  } catch {
    next(
      new ErrorHandler('Thông tin xác thực không chính xác, vui lòng đăng nhập lại.', 403)
    )
  }
})
