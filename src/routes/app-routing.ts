import { getUserProfile } from '@/controllers/userController'
import { Router } from 'express'
import { isAuthenticatedUser } from '@/middlewares/auth'
import { forgotPassword, loginUser, registerUser } from '@/controllers/authController'
import { downloadAPKFile, downloadLatestAPKFile, getAppVersionById, uploadAPKFile } from '@/controllers/uploadfileController'
import upload from '@/middlewares/upload'

const route = Router()

/// public routes
route.route('/login').post(loginUser)
route.route('/register').post(registerUser)
route.route('/reset-password').post(forgotPassword)

/// Auth routes
route.route('/me').get(isAuthenticatedUser, getUserProfile)

/// App version
route.route('/apk/upload').post(upload.single('file'), uploadAPKFile)
route.route('/apk/latest').get(downloadLatestAPKFile)
route.route('/apk/:id').get(getAppVersionById)
route.route('/apk/:id/download').get(downloadAPKFile)

export default route
