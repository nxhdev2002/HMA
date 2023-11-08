import appRouters from '@/routes/app-routing'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import catchError from '@/middlewares/catchError'
import { type Request, type Response } from 'express'
import { type HttpResponse } from './types/HttpResponse'

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../access.log'), { flags: 'a' }
)

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('combined', { stream: accessLogStream }))

/// routes
app.use('/api/v1/', appRouters)
app.use('*', (req: Request, res: Response) => {
  const resp: HttpResponse<null> = {
    status: 404,
    message: 'API Endpoint not found!!'
  }
  res.status(404).json(resp)
})

app.use(catchError)
export default app
