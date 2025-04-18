import fs from 'fs'
import moment from 'moment'
import { join, dirname } from 'path'
import { RouteOptions } from 'fastify'
import { utils, version } from '@/common'

const formatTime = (time: Date | number) => moment(time).utcOffset(8).format('YYYY/MM/DD HH:mm')

export default [
  {
    url: '/get-dir-data',
    method: 'get',
    handler: ({ query }) => {
      let { path } = query as { path: string }
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
    handler: async (request, reply) => {
      const parts = request.parts()
      const formData = {
        path: '',
        name: '',
        file: null
      } as { path: string, name: string, file: Buffer | null }
      for await (const part of parts) {
        if (part.type === 'file') {
          formData.name = part.filename
          formData.file = await part.toBuffer()
        } else if (part.fieldname === 'path') {
          formData.path = (part.value as string)
        }
      }
      const filePath = join(formData.path, formData.name)
      if (formData.path && formData.name && formData.file) {
        fs.writeFileSync(filePath, formData.file as any)
      }
      try {
        const stat = fs.statSync(filePath)
        const isDir = stat.isDirectory()
        reply.send({
          success: true,
          data: {
            name: formData.name,
            path: filePath,
            ext: isDir ? 'folder' : formData.name.split('.').pop(),
            isDir,
            size: isDir ? '' : utils.formatBytes(stat.size),
            rowSize: isDir ? 0 : stat.size,
            time: formatTime(stat.mtime),
            mtimeMs: stat.mtimeMs
          }
        })
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message
        }
      }
    }
  },
  {
    url: '/rename-file',
    method: 'post',
    handler: ({ body }) => {
      const { path, name, isDir } = body as { path: string, name: string, isDir: boolean }
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
    handler: ({ body }) => {
      const { paths } = body as { paths: { path: string, isDir: boolean }[] }
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
    handler: ({ body }) => {
      const { paths, targetPath, action } = body as { paths: { path: string, name: string, isDir: boolean }[], targetPath: string, action: 'copy' |'move' }
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
    handler: ({ body }, reply) => {
      const { path, name } = body as { path: string, name: string }
      reply.header('Content-Type', 'application/octet-stream')
      reply.header('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}"`)

      const fileStream = fs.createReadStream(path)

      fileStream.on('error', (err) => {
        reply.status(500).send(err.message)
      })
      reply.send(fileStream)
    }
  },
  {
    url: '/set-file-data',
    method: 'post',
    handler: ({ body }) => {
      const { path, data } = body as { path: string, data: string }
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
] as RouteOptions[]
