import { print } from 'sh-syntax'
import { runAsWorker } from 'synckit'

runAsWorker(print)
