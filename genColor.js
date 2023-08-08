const fs = require('licia/fs')
const each = require('licia/each')
const contain = require('licia/contain')
const kebabCase = require('licia/kebabCase')
const { theme } = require('antd')

module.exports = async function (options) {
  const { input, output } = options

  let scss = '// light\n'
  const config = JSON.parse(await fs.readFile(input, 'utf8'))

  each(theme.getDesignToken(config), (val, key) => {
    if (filter(key)) {
      return
    }
    scss += `$${kebabCase(key)}: ${val};\n`
  })

  scss += '\n// dark\n'
  config.algorithm = theme.darkAlgorithm
  each(theme.getDesignToken(config), (val, key) => {
    if (filter(key)) {
      return
    }
    scss += `$${kebabCase(key)}-dark: ${val};\n`
  })
  await fs.writeFile(output, scss, 'utf8')
}

function filter(key) {
  if (
    contain(
      [
        'blue',
        'purple',
        'cyan',
        'green',
        'magenta',
        'pink',
        'red',
        'orange',
        'yellow',
        'volcano',
        'geekblue',
        'gold',
        'lime',
      ],
      key
    )
  ) {
    return true
  }

  return !contain(key, '-') && /\d/.test(key)
}
