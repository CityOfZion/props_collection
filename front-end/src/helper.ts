import { Toast } from 'bootstrap'

export function copyClipboardEvent(text: string) {
  return (event: Event) => {
    event.preventDefault()
    navigator.clipboard.writeText(text)

    const toastEl = document.querySelector('#toast-clipboard')!
    const toast = Toast.getOrCreateInstance(toastEl)
    toast.show()
  }
}

export function toastApprovedTx(show = true) {
  const toastEl = document.querySelector('#toast-approved')!
  const toast = Toast.getOrCreateInstance(toastEl, { delay: 15000 })
  if (show) toast.show()
  else toast.hide()
}

export function toastDanger(text: string) {
  const toastEl = document.querySelector('#toast-danger')!
  toastEl.querySelector('.toast-body')!.innerHTML = text
  const toast = Toast.getOrCreateInstance(toastEl)
  toast.show()
}
