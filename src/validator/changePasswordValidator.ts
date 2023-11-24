import { body } from 'express-validator'
export const changePasswordValidator = [
  body('password')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 kí tự')
    .not()
    .isEmpty().withMessage('Vui lòng nhập mật khẩu'),
  body('otp')
    .isLength({ min: 6, max: 6 }).withMessage('OTP sai định dạng')
    .isNumeric().withMessage('OTP phải là số')
    .not()
    .isEmpty().withMessage('Vui lòng nhập mã OTP')
]
