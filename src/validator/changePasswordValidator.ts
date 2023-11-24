import { body } from 'express-validator'
export const changePasswordValidator = [
  body('password', 'Vui lòng nhập mật khẩu mới!')
    .not()
    .isEmpty()
]
