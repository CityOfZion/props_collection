import { copyClipboardEvent } from '../helper'
import typescriptTextFile from './codeTypescript.txt?raw'
import boaTextFile from './codeBoa.txt?raw'
import cpmTextFile from './codeCPM.txt?raw'


async function loadTypeScriptExample() {
  try {
    const codeElement = document.getElementById('code-typescript')
    if (codeElement) {
      codeElement.innerHTML = typescriptTextFile
    }

    document.querySelector('#copy-typescript')?.addEventListener('click', copyClipboardEvent(typescriptTextFile))
  } catch (error) {
    console.error('Failed to load TypeScript example:', error)
  }
}

async function loadBoaExample() {
  try {
    const codeElement = document.getElementById('code-boa')
    if (codeElement) {
      codeElement.innerHTML = boaTextFile
    }

    document.querySelector('#copy-boa')?.addEventListener('click', copyClipboardEvent(boaTextFile))
  } catch (error) {
    console.error('Failed to load Boa example:', error)
  }
}

async function loadCPMExample() {
  try {
    const codeElement = document.getElementById('code-cpm')
    if (codeElement) {
      codeElement.innerHTML = cpmTextFile
    }

    document.querySelector('#copy-cpm')?.addEventListener('click', copyClipboardEvent(cpmTextFile))
  } catch (error) {
    console.error('Failed to load CPM example:', error)
  }
}

export async function loadLanguagesExample() {
  loadTypeScriptExample()
  loadBoaExample()
  loadCPMExample()
}
