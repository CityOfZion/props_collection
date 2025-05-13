import { Collection } from '@cityofzion/props-collection'
import { u, wallet } from '@cityofzion/neon-js'

type CollectionType = {
  id: string
  author: string
  description: string
  extra: string
  type: string
  values: any[]
}

export const collections: CollectionType[] = []

export function cardElement(collection: CollectionType) {
  return `
    <div class="col-lg-3 col-6 d-flex align-items-stretch">
        <div type="button" class="card w-100 border-0 overflow-hidden" id="card-${collection.id}" style="height: 188px;"
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasCollection" aria-controls="offcanvasCollection">
            <div class="card-body bg-dark pt-2">
                <div class="card-title text-primary fw-medium fs-5 mb-1">${collection.id}</div>
                <p class="card-text text-white fw-light fs-18px">${collection.description}</p>
            </div>
        </div>
    </div>`
}

function addCollectionsListeners() {
  for (const col of collections) {
    document.getElementById(`card-${col.id}`)?.addEventListener('click', e => {
      e.preventDefault()
      changeOffcanvas(col)
    })
  }
}

export async function loadCollections() {
  const propCollection = await Collection.init({
    node: import.meta.env.VITE_NETWORK,
    scriptHash: import.meta.env.VITE_CONTRACT_SCRIPT_HASH,
  })

  const totalCollections = await propCollection.totalCollections()

  for (const x of Array(totalCollections).keys()) {
    const collectionId = x + 1

    collections.push(
      await propCollection.getCollectionJSON({
        collectionId,
      })
    )
  }
}

export function fillExampleCollections() {
  let collectionListInnerHtml = ''
  for (const collection of collections) {
    const collectionId = collection.id.charCodeAt(0).toString().padStart(2, '0')
    collection.id = collectionId
    collectionListInnerHtml += cardElement(collection)
  }
  document.querySelector<HTMLDivElement>('#collections-list')!.innerHTML = collectionListInnerHtml
  addCollectionsListeners()
}

function changeOffcanvas(collection: CollectionType) {
  const target = document.querySelector('#offcanvasCollection')

  const author = <HTMLInputElement>target?.querySelector('input[name=author]')
  const description = <HTMLInputElement>target?.querySelector('textarea[name=description]')
  const id = <HTMLInputElement>target?.querySelector('#collection-id')
  const extra = <HTMLInputElement>target?.querySelector('input[name=extra]')
  const type = <HTMLInputElement>target?.querySelector('input[name=collection-type]')
  const values = <HTMLInputElement>target?.querySelector('textarea[name=values]')

  const authorScriptHash = u.HexString.fromBase64(collection.author).toLittleEndian()

  author.value = wallet.getAddressFromScriptHash(authorScriptHash)
  description.value = collection.description
  id.innerText = collection.id
  extra.value = collection.extra
  type.value = collection.type
  values.value = collection.values.join()
}
