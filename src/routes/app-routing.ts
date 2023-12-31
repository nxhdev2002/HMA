import { changeUserPassword, getOTP, getUserProfile } from '@/controllers/userController'
import { Router } from 'express'
import { isAuthenticatedUser } from '@/middlewares/auth'
import { forgotPassword, loginUser, loginUserWithGoogle, registerUser } from '@/controllers/authController'
import { downloadAPKFile, downloadLatestAPKFile, downloadMusicFileById, getAppVersionById, uploadAPKFile } from '@/controllers/uploadfileController'
import upload from '@/middlewares/upload'
import { googleLoginValidator, loginValidator } from '@/validator/loginValidator'
import { registerValidator } from '@/validator/registerValidator'
import { changePasswordValidator } from '@/validator/changePasswordValidator'
import { getTrendingMusicFile, searchMusicFileByKeyWord } from '@/controllers/searchController'
import { getListLikeSong, likeSong } from '@/controllers/songController'

const route = Router()

/// public routes
route.route('/login').post(loginValidator, loginUser)
route.route('/login-google').post(googleLoginValidator, loginUserWithGoogle)
route.route('/register').post(registerValidator, registerUser)
route.route('/reset-password').post(forgotPassword)

/// profile routes
route.route('/me').get(isAuthenticatedUser, getUserProfile)
route.route('/me/liked').get(isAuthenticatedUser, getListLikeSong)
route.route('/change-password').post(isAuthenticatedUser, changePasswordValidator, changeUserPassword)
route.route('/get-otp').get(isAuthenticatedUser, getOTP)

/// music routes
route.route('/song/:id/download').get(downloadMusicFileById)
route.route('/songs').get(isAuthenticatedUser, searchMusicFileByKeyWord)
route.route('/songs/trending').get(isAuthenticatedUser, getTrendingMusicFile)
route.route('/song/:id/like').post(isAuthenticatedUser, likeSong)

/// App version
route.route('/apk/upload').post(upload.single('file'), uploadAPKFile)
route.route('/apk/latest').get(downloadLatestAPKFile)
route.route('/apk/:id').get(getAppVersionById)
route.route('/apk/:id/download').get(downloadAPKFile)

export default route
