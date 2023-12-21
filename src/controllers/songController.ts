import catchAsyncError from '@/middlewares/catchAsyncError'
import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import { type HttpResponse } from '@/types/HttpResponse'
import sequelize from '@/utils/dbConn'
import { type Response } from 'express'

export const likeSong = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  const songId = req.params.id
  await sequelize.query('call HMA_APP_MUSIC_SONG_LIKE(:p_songid, :p_userid)', {
    replacements: {
      p_songid: songId,
      p_userid: req.user.Id
    }
  })

  const resp: HttpResponse<any> = {
    status: 200,
    message: 'Liked successfully'
  }
  res.send(resp)
})

interface Songs {
  Id: number
  Name: string
  FilePath: string
  Thumbnail: string
  ArtistName: string
}

export const getListLikeSong = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  let resp: HttpResponse<Songs>
  const [liked] = await sequelize.query('call HMA_APP_MUSIC_GET_SONG_LIKE(:p_userid)', {
    replacements: {
      p_userid: req.user.Id
    }
  }) as unknown as [Songs, any]

  if (typeof liked !== 'undefined') {
    resp = {
      status: 200,
      data: liked,
      message: 'Get liked successfully'
    }
  } else {
    resp = {
      status: 200,
      data: liked,
      message: 'Get liked successfully'
    }
  }
  res.send(resp)
})
