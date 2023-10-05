import { getUserProfile } from '@/controllers/userController'
import { Router } from 'express'
import { isAuthenticatedUser } from '@/middlewares/auth'
import { loginUser, registerUser } from '@/controllers/authController'

const route = Router()

/// public routes
route.route('/login').post(loginUser)
route.route('/register').post(registerUser)

/// Auth routes
route.route('/me').get(isAuthenticatedUser, getUserProfile)
export default route
