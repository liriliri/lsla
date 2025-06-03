const fs = require('licia/fs')
const each = require('licia/each')
const startWith = require('licia/startWith')
const endWith = require('licia/endWith')
const contain = require('licia/contain')
const kebabCase = require('licia/kebabCase')
const camelCase = require('licia/camelCase')
const cloneDeep = require('licia/cloneDeep')
const { theme } = require('antd')

module.exports = async function (options) {
  const { input, output } = options
  const config = JSON.parse(await fs.readFile(input, 'utf8'))

  let result = ''
  if (endWith(output, '.ts') || endWith(output, '.js')) {
    result = await outputTs(config)
  } else {
    result = await outputScss(config, output)
  }

  await fs.writeFile(output, result, 'utf8')
}

async function outputScss(config, output) {
  return outputTpl(
    config,
    (key, val, isDark) => {
      if (isDark) {
        return `$${kebabCase(key)}-dark: ${val};\n`
      } else {
        return `$${kebabCase(key)}: ${val};\n`
      }
    },
    config
  )
}

function outputTs(config) {
  return outputTpl(
    config,
    (key, val, isDark) => {
      if (isDark) {
        return `export const ${camelCase(key)}Dark = \`${val}\`\n`
      } else {
        return `export const ${camelCase(key)} = \`${val}\`\n`
      }
    },
    config
  )
}

function outputTpl(config, tpl) {
  let ts = '// light\n'

  const lightConfig = cloneDeep(config)
  const darkConfig = cloneDeep(config)

  each(config.token, (val, key) => {
    if (endWith(key, 'Dark')) {
      const lightKey = key.replace('Dark', '')
      if (config.token[lightKey]) {
        delete lightConfig.token[key]
        darkConfig.token[lightKey] = val
        delete darkConfig.token[key]
      }
    }
  })

  each(theme.getDesignToken(lightConfig), (val, key) => {
    if (filter(key)) {
      return
    }
    ts += tpl(key, val, false)
  })

  ts += '\n// dark\n'
  darkConfig.algorithm = theme.darkAlgorithm
  each(theme.getDesignToken(darkConfig), (val, key) => {
    if (filter(key) || filterDark(key)) {
      return
    }
    ts += tpl(key, val, true)
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
