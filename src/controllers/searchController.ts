/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/indent */
import { type Request, type Response } from 'express'
import { type HttpResponse } from '@/types/HttpResponse'
import catchAsyncError from '@/middlewares/catchAsyncError'
import sequelize from '@/utils/dbConn'
interface MusicPath {
    Id: number
    Name: string
    FilePath: string
    Quality: string
  }
export const searchMusicFileById = catchAsyncError(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const [results] = await sequelize.query('call HMA_APP_MUSIC_GET_INFO_BY_ID(:id)', {
      replacements: {
        id
      }
    }) as unknown as [MusicPath, any]
    if (results === null) {
      const resp: HttpResponse<any> = {
        status: 404,
        message: 'File not found'
      }
      res.status(404).send(resp)
    }
  })