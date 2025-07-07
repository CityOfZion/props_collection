import { Neo3EventListener, Neo3Invoker, Neo3Parser } from '@cityofzion/neon-dappkit-types'
import Neon from '@cityofzion/neon-core'

/**
 * Defines configuration options for initializing an instance of a Collection.
 * @prop node Blockchain node URL
 * @prop scriptHash Contract script hash
 * @prop invoker NeonInvoker instance for invoking smart contracts
 * @prop parser NeonParser instance for parsing responses
 * @prop account Neon.wallet.Account for handling transactions
 * @group Interface
 */
export interface ConstructorOptions {
  node?: string
  scriptHash?: string
  invoker?: Neo3Invoker
  listener?: Neo3EventListener
  parser?: Neo3Parser
  account?: Neon.wallet.Account
}

/**
 * Defines options for contract invocation.
 * @prop timeout Determines how long in microseconds the function should wait for the transaction to be completed
 * @group Interface
 */
export interface InvocationOptions {
  timeout?: number
}
