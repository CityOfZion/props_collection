import {
  CollectionAPI,
  CreateCollection,
  SampleFromRuntimeCollection,
  SampleFromCollection,
} from '@cityofzion/props-collection'
import { Offcanvas } from 'bootstrap'
import { toastApprovedTx, copyClipboardEvent, toastDanger } from '../helper'
import UniversalProvider from '@walletconnect/universal-provider'
import { WalletConnectModal } from '@walletconnect/modal'
import { NeonEventListener, NeonParser } from '@cityofzion/neon-dappkit'

let wcUniversalProvider: UniversalProvider
const collectionScriptHash = import.meta.env.VITE_CONTRACT_SCRIPT_HASH
const networkType = import.meta.env.VITE_NETWORK_TYPE

const modal = new WalletConnectModal({
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [networkType],
  explorerRecommendedWalletIds: ['f039a4bdf6d5a54065b6cc4b134e32d23bed5d391ad97f25aab5627de26a0784'],
  themeMode: 'dark',
})

export const initWalletConnect = async () => {
  addWcEventListeners()

  wcUniversalProvider = await UniversalProvider.init({
    projectId: import.meta.env.VITE_PROJECT_ID,
    metadata: {
      name: 'PROPS Collection',
      description: 'This dapp demonstrates how to integrate the PROPS Collection smart contract into web applications.',
      url: 'https://github.com/CityOfZion/props_collection/',
      icons: [new URL(import.meta.env.BASE_URL + 'props_icon.svg', import.meta.url).href],
    },
  })

  changeConnectButtonVisibility(isConnected())

  wcUniversalProvider.on('display_uri', (uri: string) => {
    modal.openModal({ uri, chains: [networkType] })
  })
  wcUniversalProvider.on('connect', (session: any) => {
    changeConnectButtonVisibility(Boolean(session))
    modal.closeModal()
  })
  wcUniversalProvider.on('session_delete', () => {
    changeConnectButtonVisibility(isConnected())
  })
}

// #region Wallet Connect methods

function isConnected() {
  return !!wcUniversalProvider.session
}

async function connectWc() {
  if (!isConnected()) {
    await wcUniversalProvider.connect({
      namespaces: {
        neo3: {
          methods: ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage', 'calculateFee', 'signTransaction'],
          chains: [networkType],
          events: [],
        },
      },
    })
  }
}

async function disconnectWc() {
  await wcUniversalProvider.disconnect()
  changeConnectButtonVisibility(isConnected())
}

async function createCollection(params: CreateCollection): Promise<[string, (results: any) => string]> {
  const invocation = CollectionAPI.createCollection(collectionScriptHash, params)

  const txId: string = await wcUniversalProvider.request(
    {
      method: 'invokeFunction',
      params: {
        invocations: [invocation],
        signers: [{ scopes: 1 }],
      },
    },
    networkType
  )

  const convertReturn = (resultsStack: any) => {
    const collectionId = resultsStack.value
    return collectionId
  }

  return [txId, convertReturn]
}

async function sampleFromCollection(params: SampleFromCollection): Promise<[string, (results: any) => string]> {
  const invocation = CollectionAPI.sampleFromCollection(collectionScriptHash, params)

  const txId: string = await wcUniversalProvider.request(
    {
      method: 'invokeFunction',
      params: {
        invocations: [invocation],
        signers: [{ scopes: 1 }],
      },
    },
    networkType
  )

  const convertReturn = (resultsStack: any) => {
    const resultsString = (resultsStack.value! as [])
      .map((stackItem: any) => NeonParser.parseRpcResponse(stackItem))
      .join(', ')
    return resultsString
  }

  return [txId, convertReturn]
}

async function sampleFromRuntimeCollection(
  params: SampleFromRuntimeCollection
): Promise<[string, (results: any) => string]> {
  const invocation = CollectionAPI.sampleFromRuntimeCollection(collectionScriptHash, params)

  const txId: string = await wcUniversalProvider.request(
    {
      method: 'invokeFunction',
      params: {
        invocations: [invocation],
        signers: [{ scopes: 1 }],
      },
    },
    networkType
  )

  const convertReturn = (resultsStack: any) => {
    const resultsString = (resultsStack.value! as [])
      .map((stackItem: any) => NeonParser.parseRpcResponse(stackItem))
      .join(', ')
    return resultsString
  }

  return [txId, convertReturn]
}

// #endregion

// #region HTML related code

function changeConnectButtonVisibility(isConnected: boolean) {
  const visibleElement = isConnected ? 'disconnect-button' : 'connect-button'
  const invisibleElement = isConnected ? 'connect-button' : 'disconnect-button'

  document.getElementById(visibleElement)?.classList.remove('d-none')
  document.getElementById(invisibleElement)?.classList.add('d-none')
}

enum ButtonStage {
  Sample = 'Sample',
  Create = 'Create',
  WaitWallet = 'Check your wallet to approve',
  Approved = 'Approved',
}

function changeInvokeButton(formElement: Element | null, buttonStage: ButtonStage) {
  if (!formElement) return

  const btnSubmit = <HTMLButtonElement>formElement.querySelector('button[name=btn-submit]')
  const btnDisabled = <HTMLButtonElement>formElement.querySelector('button[name=btn-disabled]')

  if (buttonStage === ButtonStage.WaitWallet || buttonStage === ButtonStage.Approved) {
    const waitWalletElement = `
      <div class="position-absolute ms-4 top-50 start-0 translate-middle" style="width:1.25rem; height:1.25rem;" role="status">
        <div class="spinner-border d-flex w-100 h-100"></div>
      </div>
      ${ButtonStage.WaitWallet}
    `
    const approvedElement = `
      <img src="${
        import.meta.env.BASE_URL
      }checkmark_icon.svg" class="position-absolute ms-4 top-50 start-0 translate-middle" style="width:1.5rem; height:1.5rem;" role="status">
      ${ButtonStage.Approved}
    `
    const disabledElement = buttonStage === ButtonStage.WaitWallet ? waitWalletElement : approvedElement

    btnDisabled.innerHTML = disabledElement
    btnSubmit.classList.add('d-none')
    btnDisabled.classList.remove('d-none')
  } else {
    btnSubmit.classList.remove('d-none')
    btnDisabled.classList.add('d-none')
  }
}

async function showTxResults(txId: string, parseStackResult: (x: any) => string) {
  let appLog

  try {
    appLog = await new NeonEventListener(import.meta.env.VITE_NETWORK).waitForApplicationLog(txId)
  } catch (error: any) {
    throw new Error(error)
  }

  const results = appLog.executions[0]

  const offcanvasElement = document.querySelector('#offcanvasResult')
  if (offcanvasElement) {
    const vmStateEl = offcanvasElement.querySelector('[name=vm-state]')
    vmStateEl!.className = `badge rounded-pill fs-6 ${
      results.vmstate === 'HALT' ? 'text-bg-success' : 'text-bg-danger'
    }`
    vmStateEl!.innerHTML = results.vmstate

    const txFeeWithDecimals = (Number(results.gasconsumed) / 10 ** 8).toFixed(8)
    ;(<HTMLInputElement>offcanvasElement.querySelector('input[name=transaction-fee]')).value = txFeeWithDecimals

    const resultsStringParsed = parseStackResult(results.stack![0])

    offcanvasElement.querySelector('textarea[name=result]')!.innerHTML = resultsStringParsed
    offcanvasElement.querySelector('#copy-results')?.addEventListener('click', copyClipboardEvent(resultsStringParsed))

    toastApprovedTx(false)

    const offcanvasResult = new Offcanvas(offcanvasElement)
    offcanvasResult.show()
  }
}

function addWcEventListeners() {
  document.getElementById('connect-button')?.addEventListener('click', connectWc)
  document.getElementById('disconnect-button')?.addEventListener('click', disconnectWc)
  document.getElementById('form-create-collection')?.addEventListener('submit', async e => {
    e.preventDefault()
    if (!isConnected()) {
      toastDanger('Please connect your wallet')
      return
    }
    const target = document.querySelector('#form-create-collection')

    try {
      const description = (<HTMLInputElement>target?.querySelector('input[name=description]')).value
      const collectionTypeDiv = target?.querySelector('#create-collection-type')
      const collectionTypeSelect = (<HTMLSelectElement>collectionTypeDiv?.querySelector('select')).value
      const collectionTypeInput = (<HTMLInputElement>collectionTypeDiv?.querySelector('input')).value
      const collectionType = collectionTypeSelect === 'Other' ? collectionTypeInput : collectionTypeSelect
      const extra = (<HTMLInputElement>target?.querySelector('input[name=extra]')).value
      const values = (<HTMLTextAreaElement>target?.querySelector('textarea[name=values]')).value
        .split(',')
        .map(value => value.trim())

      changeInvokeButton(target, ButtonStage.WaitWallet)

      const [txId, convertReturn] = await createCollection({ description, collectionType, extra, values })

      changeInvokeButton(target, ButtonStage.Approved)
      toastApprovedTx()
      await showTxResults(txId, convertReturn)
    } catch (error: any) {
      toastDanger(error.message)
    }
    changeInvokeButton(target, ButtonStage.Create)
  })

  document.getElementById('form-sample-collection')?.addEventListener('submit', async e => {
    e.preventDefault()
    if (!isConnected()) {
      toastDanger('Please connect your wallet')
      return
    }
    const target = document.querySelector('#form-sample-collection')

    try {
      const collectionId = (<HTMLInputElement>target?.querySelector('select[name=collection-id]')).value.replace(
        /^0+/,
        ''
      )
      const samples = (<HTMLInputElement>target?.querySelector('input[name=sample-count]')).value

      changeInvokeButton(target, ButtonStage.WaitWallet)

      const [txId, convertReturn] = await sampleFromCollection({
        collectionId: Number(collectionId),
        samples: Number(samples),
      })

      changeInvokeButton(target, ButtonStage.Approved)
      toastApprovedTx()
      await showTxResults(txId, convertReturn)
    } catch (error: any) {
      toastDanger(error.message)
    }
    changeInvokeButton(target, ButtonStage.Sample)
  })

  document.getElementById('form-sample-runtime-collection')?.addEventListener('submit', async e => {
    e.preventDefault()
    if (!isConnected()) {
      toastDanger('Please connect your wallet')
      return
    }
    const target = document.querySelector('#form-sample-runtime-collection')

    try {
      const valuesCsv = (<HTMLTextAreaElement>target?.querySelector('textarea[name=values]')).value
      const values = valuesCsv.split(',').map(value => value.trim())
      const samples = (<HTMLInputElement>target?.querySelector('input[name=sample-count]')).value
      const pick = (<HTMLInputElement>target?.querySelector('input[name=switch]')).checked

      changeInvokeButton(target, ButtonStage.WaitWallet)

      const [txId, convertReturn] = await sampleFromRuntimeCollection({
        values,
        samples: Number(samples),
        pick,
      })

      changeInvokeButton(target, ButtonStage.Approved)
      toastApprovedTx()
      await showTxResults(txId, convertReturn)
    } catch (error: any) {
      toastDanger(error.message)
    }

    changeInvokeButton(target, ButtonStage.Sample)
  })
}

// #endregion
