const webfontsGenerator = require('@vusion/webfonts-generator')
const fs = require('licia/fs')
const map = require('licia/map')
const filter = require('licia/filter')
const endWith = require('licia/endWith')
const promisify = require('licia/promisify')
const path = require('path')

const generate = promisify(webfontsGenerator)

module.exports = async function (options) {
  const { input, output, name } = options

  const iconDir = path.resolve(input)
  let files = await fs.readdir(iconDir)
  files = filter(files, (file) => endWith(file, '.svg'))
  const dest = path.resolve(__dirname, './icon')
  const result = await generate({
    files: map(files, (file) => iconDir + '/' + file),
    types: ['woff'],
    cssTemplate: path.resolve(__dirname, 'cssTemplate.hbs'),
    dest,
    templateOptions: {
      name,
    },
    writeFiles: false,
  })
  const iconData = result.woff.toString('base64')
  const css = result.generateCss({
    woff: 'data:application/x-font-woff;charset=utf-8;base64,' + iconData,
  })
  await fs.writeFile(path.resolve(output), css, 'utf8')
}
