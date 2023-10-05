import type User from '@/models/User'
import { type Request } from 'express'
export interface GetUserAuthInfoRequest extends Request {
  user: User // or any other type
}
