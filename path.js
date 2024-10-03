import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

function replacePaths (dir) {
  readdirSync(dir).forEach(file => {
    const filePath = join(dir, file)
    if (statSync(filePath).isDirectory()) {
      replacePaths(filePath)
    } else if (filePath.endsWith('.js')) {
      let content = readFileSync(filePath, 'utf-8')
      content = content.replace(/from ['"]((\.?\.\/)+.+?)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js')) {
          if (existsSync(join(dir, p1, 'index.js'))) {
            return `from '${p1}/index.js'`
          } else {
            return `from '${p1}.js'`
          }
        }
        return `from '${p1}'`
      })
      writeFileSync(filePath, content, 'utf-8')
    }
  })
}

replacePaths('./lib')
