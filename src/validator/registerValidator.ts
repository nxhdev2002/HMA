import { body } from 'express-validator'

export const registerValidator = [
  body('username', 'Vui lòng nhập username')
    .not()
    .isEmpty(),
  body('password', 'Vui lòng nhập password')
    .not()
    .isEmpty()
    .isLength({ min: 8 })
    .withMessage('Mật khẩu yêu cầu 8 kí tự trở lên'),
  body('name', 'Vui lòng nhập họ và tên')
    .not()
    .isEmpty(),
  body('email', 'Vui lòng nhập email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Email không đúng định dạng, vui lòng kiếm tra lại')
]
