#!/usr/bin/env node
const yargs = require('yargs')

const cli = yargs
  .commandDir('commands')
  .demand(1)

// finalize cli setup
cli.help()
  .strict()
  .completion()
  .argv
