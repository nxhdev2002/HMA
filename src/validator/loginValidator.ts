/* eslint-disable eol-last */
import { body } from 'express-validator'
export const loginValidator = [
  body('username', 'Vui lòng nhập tên người dùng').not().isEmpty(),
  body('password', 'Vui lòng nhập mật khẩu').not().isEmpty()
]