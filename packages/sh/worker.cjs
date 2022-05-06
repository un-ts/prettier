// @ts-check

const { processor } = require('sh-syntax')
const { runAsWorker } = require('synckit')

runAsWorker(processor)
