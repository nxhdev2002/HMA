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
  Thumbnail: string
  ArtistName: string
}
export const searchMusicFileByKeyWord = catchAsyncError(async (req: Request, res: Response): Promise<void> => {
  const results = await sequelize.query('call HMA_APP_MUSIC_GET_SONGS_BY_KEYWORD(:keyword)', {
    replacements: {
      keyword: req.query.key
    }
  }) as unknown as [MusicPath[], any]

  const resp: HttpResponse<any> = {
      status: 200,
      message: 'Get music successfully',
      data: results
  }
  res.send(resp)
})
export const getTrendingMusicFile = catchAsyncError(async (req: Request, res: Response): Promise<void> => {
  const results = await sequelize.query('call HMA_APP_MUSIC_GET_TOP_TRENDING', {
    replacements: {
    }
  }) as unknown as [MusicPath[], any]

  const resp: HttpResponse<any> = {
      status: 200,
      message: 'Get music successfully',
      data: results
  }
  res.send(resp)
})