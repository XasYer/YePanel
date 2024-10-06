import fs from 'fs'
import multer from 'multer'
import moment from 'moment'
import { join, dirname } from 'path'
import { httpRoute } from '@/types/route'
import { utils, version } from '@/common'

const formatTime = (time: Date | number) => moment(time).utcOffset(8).format('YYYY/MM/DD HH:mm')

export default {
  http: [
    {
      url: '/get-dir-data',
      method: 'post',
      token: true,
      response: ({ body }) => {
        let { path } = body
        if (!path) {
          path = version.BotPath
        }
        path = path.replace(/\\/g, '/')
        const parentPath = join(path, '..').replace(/\\/g, '/')
        const data: {
          path: string,
          parentPath: string,
          files: {
            name: string,
            path: string,
            ext: string,
            isDir: boolean,
            size: string,
            rowSize: number,
            time: string,
            mtimeMs: number
          }[]
        } = {
          path,
          parentPath: parentPath === path ? '' : parentPath,
          files: []
        }
        try {
          fs.readdirSync(path).forEach(name => {
            try {
              const filePath = join(path, name)
              const stat = fs.statSync(filePath)
              const isDir = stat.isDirectory()
              data.files.push({
                name,
                path: filePath,
                ext: isDir ? 'folder' : name.split('.').pop() as string,
                isDir,
                size: isDir ? '' : utils.formatBytes(stat.size),
                rowSize: isDir ? 0 : stat.size,
                time: formatTime(stat.mtime),
                mtimeMs: stat.mtimeMs
              })
            } catch { /* empty */ }
          })
        } catch (error) {
          return {
            success: false,
            message: (error as Error).message
          }
        }
        return {
          success: true,
          data
        }
      }
    },
    {
      url: '/upload-file',
      method: 'post',
      token: true,
      response: ({ file }) => {
        const res = {
          success: true,
          data: {
            name: file!.originalname,
            path: file!.path,
            ext: file!.originalname.split('.').pop(),
            size: utils.formatBytes(file!.size),
            rowSize: file!.size,
            time: formatTime(Date.now()),
            mtimeMs: Date.now(),
            isDir: false
          },
          message: ''
        }
        if (!fs.existsSync(file!.path)) {
          res.success = false
          res.message = '上传失败'
        }
        return res
      },
      handler: multer({
        storage: multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, req.body.path)
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname)
          }
        })
      }).single('file')
    },
    {
      url: '/rename-file',
      method: 'post',
      token: true,
      response: ({ body }) => {
        const { path, name, isDir } = body
        const newName = join(dirname(path), name)
        try {
          // 如果文件存在就是重命名，不存在就是创建文件
          if (fs.existsSync(path)) {
            fs.renameSync(path, newName)
            const stat = fs.statSync(newName)
            const isDir = stat.isDirectory()
            return {
              success: true,
              data: {
                name,
                path: newName,
                ext: isDir ? 'folder' : name.split('.').pop(),
                isDir,
                size: isDir ? '' : utils.formatBytes(stat.size),
                rowSize: isDir ? 0 : stat.size,
                time: formatTime(stat.mtime),
                mtimeMs: stat.mtimeMs
              }
            }
          } else {
            if (isDir) {
              fs.mkdirSync(newName)
              return {
                success: true
              }
            } else {
              fs.writeFileSync(newName, '', 'utf-8')
              return {
                success: true
              }
            }
          }
        } catch (error) {
          return {
            success: false,
            message: (error as Error).message
          }
        }
      }
    },
    {
      url: '/delete-file',
      method: 'post',
      token: true,
      response: ({ body }) => {
        const { paths } = body
        const errors = []
        for (const { path, isDir } of paths) {
          try {
            if (isDir) {
              fs.rmdirSync(path, { recursive: true })
            } else {
              fs.unlinkSync(path)
            }
          } catch (error) {
            errors.push({ path, isDir, message: (error as Error).message })
          }
        }
        return {
          success: true,
          errors
        }
      }
    },
    {
      url: '/move-file',
      method: 'post',
      token: true,
      response: ({ body }) => {
        const { paths, targetPath, action } = body
        const errors = []
        for (const { path, name, isDir } of paths) {
          try {
            const newPath = join(targetPath, name)
            if (action === 'copy') {
              fs.copyFileSync(path, newPath)
            } else if (action === 'move') {
              fs.renameSync(path, newPath)
            }
          } catch (error) {
            errors.push({ path, isDir, message: (error as Error).message })
          }
        }
        return {
          success: true,
          errors
        }
      }
    },
    {
      url: '/download-file',
      method: 'post',
      token: true,
      contentType: 'application/octet-stream',
      response: ({ body }, res) => {
        const { path, name } = body
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
        const fileStream = fs.createReadStream(path)
        fileStream.pipe(res)
        fileStream.on('error', (err) => {
          res.status(500).send(err.message)
        })
      }
    },
    {
      url: '/set-file-data',
      method: 'post',
      token: true,
      response: ({ body }) => {
        const { path, data } = body
        try {
          fs.writeFileSync(path, data, 'utf-8')
          return {
            success: true
          }
        } catch (error) {
          return {
            success: false,
            message: (error as Error).message
          }
        }
      }
    }
  ]
} as { http: httpRoute[]}
