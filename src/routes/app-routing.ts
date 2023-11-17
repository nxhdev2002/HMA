import { getUserProfile } from '@/controllers/userController'
import { Router } from 'express'
import { isAuthenticatedUser } from '@/middlewares/auth'
import { loginUser, registerUser } from '@/controllers/authController'
import { downloadAPKFile, downloadLatestAPKFile, getAppVersionById, uploadAPKFile } from '@/controllers/uploadfileController'
import upload from '@/middlewares/upload'
import { loginValidator } from '@/validator/loginValidator'

const route = Router()

/// public routes
route.route('/login').post(loginValidator, loginUser)
route.route('/register').post(registerUser)

/// Auth routes
route.route('/me').get(isAuthenticatedUser, getUserProfile)

/// App version
route.route('/apk/upload').post(upload.single('file'), uploadAPKFile)
route.route('/apk/latest').get(downloadLatestAPKFile)
route.route('/apk/:id').get(getAppVersionById)
route.route('/apk/:id/download').get(downloadAPKFile)

export default route
