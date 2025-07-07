import './scss/styles.scss'
import 'bootstrap'
import { fillExampleCollections, loadCollections } from './collections'
import { renderLanguagesExample } from './quickstart'
import { initWalletConnect } from './wallet-connect'
import { initOffcanvas, renderOffcanvas } from './offcanvas'
import { initTooltips } from './helper'

async function renderComponents() {
  await renderLanguagesExample()
  await renderOffcanvas()
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderComponents()

  initWalletConnect()

  await loadCollections()
  fillExampleCollections()

  initOffcanvas()
  initTooltips()
})
