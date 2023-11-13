/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Request, type Response } from 'express'
import { type HttpResponse } from '@/types/HttpResponse'
import catchAsyncError from '@/middlewares/catchAsyncError'
import { type GetUserAuthInfoRequest } from '@/types/GetUserAuthInfoRequest'
import AppVersion from '@/models/AppVersion'
import sequelize from '@/utils/dbConn'

export const getAppVersionById = catchAsyncError(async (req: GetUserAuthInfoRequest, res: Response): Promise<void> => {
  const id = req.params.id
  const [results, _] = await sequelize.query('call HMA_APPVERSION_GET_BY_ID(:id)', {
    replacements: {
      id
    }
  })
  console.log(results)
  const resp: HttpResponse<AppVersion | any> = {
    status: 0,
    message: '',
    data: results
  }
  res.status(200).json(resp)
})

export const uploadAPKFile = catchAsyncError(async (req: Request, res: Response): Promise<void> => {
  // validate du lieu
  const file = req.file
  if (file?.originalname.endsWith('.apk') !== true) {
    const resp: HttpResponse<AppVersion> = {
      status: 400,
      message: 'File error'
    }
    res.send(resp)
  }
  // upload apk
  const appversion = await AppVersion.create({
    FileData: file?.size,
    FileName: file?.originalname,
    FilePath: file?.path,
    Version: 1
  })

  //
  const resp: HttpResponse<AppVersion> = {
    status: 201,
    message: 'Uploaded file successfully',
    data: appversion
  }

  res.status(201).send(resp)
})

export const downloadAPKFile = catchAsyncError(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [results, _] = await sequelize.query('call HMA_APPVERSION_GET_BY_ID(:id)', {
    replacements: {
      id
    }
  }) as unknown as [AppVersion, any]
  // console.log(results)
  // const resp: HttpResponse<AppVersion> = {
  //   status: 0,
  //   message: '',
  //   data: results
  // }
  // res.status(200).json(resp)
  if (results === null) {
    const resp: HttpResponse<any> = {
      status: 404,
      message: 'File not found'
    }
    res.status(404).send(resp)
  }
  res.download(results.FilePath)
})

export const downloadLatestAPKFile = catchAsyncError(async (req: Request, res: Response): Promise<void> => {
  const [results, _] = await sequelize.query('call HMA_APPVERSION_GET_LATEST()') as unknown as [AppVersion, any]
  if (results === null) {
    const resp: HttpResponse<any> = {
      status: 404,
      message: 'File not found'
    }
    res.status(404).send(resp)
  }
  res.download(results.FilePath)
})
