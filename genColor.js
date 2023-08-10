const fs = require('licia/fs')
const each = require('licia/each')
const startWith = require('licia/startWith')
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
    if (filter(key) || filterDark(key)) {
      return
    }
    scss += `$${kebabCase(key)}-dark: ${val};\n`
  })
  await fs.writeFile(output, scss, 'utf8')
}

const colors = [
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
]

function filter(key) {
  if (contain(colors, key)) {
    return true
  }

  return !contain(key, '-') && /\d/.test(key)
}

function filterDark(key) {
  if (startWith(key, 'color') || startWith(key, 'boxShadow')) {
    return false
  }

  for (const color of colors) {
    if (startWith(key, color)) {
      return false
    }
  }

  return true
}
