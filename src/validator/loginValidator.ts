import { body } from 'express-validator'
export const loginValidator = [
  body('username', 'Vui lòng nhập tên người dùng hoặc email')
    .not()
    .isEmpty(),
  body('password', 'Vui lòng nhập mật khẩu')
    .not()
    .isEmpty()
]

export const googleLoginValidator = [
  body('token', 'Trường token không được trống.')
    .not()
    .isEmpty()
]
