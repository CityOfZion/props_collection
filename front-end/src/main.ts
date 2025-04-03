import './scss/styles.scss'
import 'bootstrap'
import { fillExampleCollections, loadCollections } from './collections'
import { loadLanguagesExample } from './quickstart'
import { initWalletConnect } from './wallet-connect'

initWalletConnect()
document.addEventListener('DOMContentLoaded', async () => {
  await loadLanguagesExample()
  await loadCollections()

  fillExampleCollections()
})
