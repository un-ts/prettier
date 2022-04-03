import { processor } from 'sh-syntax'
import { runAsWorker } from 'synckit'

runAsWorker(processor)
