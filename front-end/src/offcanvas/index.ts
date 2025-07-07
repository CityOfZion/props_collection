import { collections } from '../collections'
import offcanvasCreate from './offcanvasCreate.html?raw'
import offcanvasSampleCollection from './offcanvasSampleCollection.html?raw'
import offcanvasSampleRuntime from './offcanvasSampleRuntime.html?raw'
import offcanvasResults from './offcanvasResults.html?raw'

export async function renderOffcanvas() {
  const components = [offcanvasCreate, offcanvasSampleCollection, offcanvasSampleRuntime, offcanvasResults]

  const container = document.getElementById('features-section')
  if (container) {
    components.forEach(html => {
      container.insertAdjacentHTML('beforeend', html)
    })
  }
}

function initCreateCollection() {
  const collectionTypeInputGroup = document.getElementById('create-collection-type')
  const collectionTypeSelect = collectionTypeInputGroup?.getElementsByClassName('form-select')[0]
  const collectionTypeInput = collectionTypeInputGroup?.getElementsByTagName('input')[0]
  if (!collectionTypeSelect || !collectionTypeInput) return

  collectionTypeSelect?.addEventListener('change', event => {
    event.preventDefault()

    const selectedValue = (event.target as HTMLSelectElement).value

    if (selectedValue === 'Other') {
      collectionTypeInput.classList.remove('d-none')
      collectionTypeInput.classList.add('d-block')
      collectionTypeInput.disabled = false
      collectionTypeInput.focus()
    } else {
      collectionTypeInput.classList.remove('d-block')
      collectionTypeInput.classList.add('d-none')
      collectionTypeInput.disabled = true
      collectionTypeInput.value = ''
    }
  })
}

function initSampleCollection() {
  const formSampleCollection = document.getElementById('form-sample-collection')
  const sampleCollectionSelect = <HTMLSelectElement>formSampleCollection?.querySelector('select[name=collection-id]')

  collections.forEach(collection => {
    const option = `<option value="${collection.id}">${collection.id} - ${collection.description}</option>`
    sampleCollectionSelect.insertAdjacentHTML('beforeend', option)
  })
}

export function initOffcanvas() {
  initCreateCollection()
  initSampleCollection()
}
