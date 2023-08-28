const fs = require('licia/fs')
const each = require('licia/each')
const startWith = require('licia/startWith')
const endWith = require('licia/endWith')
const contain = require('licia/contain')
const kebabCase = require('licia/kebabCase')
const camelCase = require('licia/camelCase')
const { theme } = require('antd')

module.exports = async function (options) {
  const { input, output } = options
  const config = JSON.parse(await fs.readFile(input, 'utf8'))

  let result = ''
  if (endWith(output, '.ts')) {
    result = await outputTs(config)
  } else {
    result = await outputScss(config, output)
  }

  await fs.writeFile(output, result, 'utf8')
}

async function outputScss(config, output) {
  let scss = '// light\n'

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

  return scss
}

function outputTs(config) {
  let ts = '// light\n'

  each(theme.getDesignToken(config), (val, key) => {
    if (filter(key)) {
      return
    }
    ts += `export const ${camelCase(key)} = \`${val}\`\n`
  })

  ts += '\n// dark\n'
  config.algorithm = theme.darkAlgorithm
  each(theme.getDesignToken(config), (val, key) => {
    if (filter(key) || filterDark(key)) {
      return
    }
    ts += `export const ${camelCase(key)}Dark = \`${val}\`\n`
  })

  return ts
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
