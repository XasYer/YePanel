import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

function replacePaths (dir) {
  readdirSync(dir).forEach(file => {
    const filePath = join(dir, file)
    if (statSync(filePath).isDirectory()) {
      replacePaths(filePath)
    } else if (filePath.endsWith('.js')) {
      let content = readFileSync(filePath, 'utf-8')
      content = content.replace(/(from|import) ['"]((\.?\.\/)+.+?)['"]/g, (match, target, name) => {
        if (!name.endsWith('.js')) {
          if (existsSync(join(dir, name, 'index.js'))) {
            return `${target} '${name}/index.js'`
          } else {
            return `${target} '${name}.js'`
          }
        }
        return `${target} '${name}'`
      })
      writeFileSync(filePath, content, 'utf-8')
    }
  })
}

replacePaths('./lib')
