import appRouters from '@/routes/app-routing'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import catchError from '@/middlewares/catchError'
import * as FileStreamRotator from 'file-stream-rotator'
import { type Request, type Response } from 'express'
import { type HttpResponse } from './types/HttpResponse'

const app = express()

app.use(cors())
app.use(express.json())

const logDirectory = path.join(__dirname, '../logs')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  date_format: 'YYYY-MM-DD',
  frequency: 'daily',
  verbose: false
})

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
