import { Neo3Invoker } from '@cityofzion/neo3-invoker'
import { Neo3Parser } from '@cityofzion/neo3-parser'

export type SmartContractConfig = {
  scriptHash: string
  invoker: Neo3Invoker
  parser: Neo3Parser
}

export type pollingOptions = {
  period: number
  timeout: number
  node: string
}