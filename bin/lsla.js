#!/usr/bin/env node

const parseArgs = require('licia/parseArgs')
const contain = require('licia/contain')
const execa = require('execa')
const path = require('path')

const options = parseArgs(process.argv.slice(2), {
  names: {
    input: 'string',
    output: 'string',
    name: 'string',
  },
})

const remain = options.remain

const cmd = remain[0]

if (contain(['prettier', 'shx'], cmd)) {
  execa(
    path.resolve(__dirname, '../node_modules/.bin', cmd),
    process.argv.slice(3),
    {
      stdio: 'inherit',
    }
  )
} else if (contain(['genIcon'], cmd)) {
  require('../' + cmd)(options)
} else if (contain(['genTheme'], cmd)) {
  require('../' + cmd)(options)
} else {
  console.log('Cmd not supported')
}
