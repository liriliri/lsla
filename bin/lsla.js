#!/usr/bin/env node

const parseArgs = require('licia/parseArgs')

const options = parseArgs(process.argv.slice(2), {
  names: {
    input: 'string',
    output: 'string',
    name: 'string',
  },
})

const remain = options.remain

const cmd = remain[0]

require('../' + cmd)(options)
