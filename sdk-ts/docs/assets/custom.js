// Adds an accordion to overloaded functions
;(function () {
  for (const container of document.querySelectorAll('.tsd-signatures')) {
    // Don't bother attaching event listeners if there is only one signature
    if (container.children.length > 1) {
      initSignatures(container)
    }
  }

  /** @param {Element} container */
  function initSignatures(container) {
    const headings = Array.from(container.children, e => e.children[0])
    const descriptions = Array.from(container.children, e => e.children[1])
    descriptions.forEach(e => e.remove())

    let currentIndex = 0
    for (let i = 0; i < container.children.length; i++) {
      // Get rid of a slightly thicker border between items
      if (i !== 0) {
        container.children[i].children[0].style.borderTop = '0'
      }

      container.children[i].children[0].addEventListener('click', () => {
        updateDisplay(i)
      })

      // If we were linked to a specific overload, show that one initially
      if (location.hash && container.children[i].querySelector(location.hash)) {
        currentIndex = i
      }
    }

    updateDisplay(currentIndex)

    function updateDisplay(newIndex) {
      headings[currentIndex].style.background = 'inherit'
      headings[newIndex].style.background = 'var(--color-active-menu-item)'
      descriptions[currentIndex].remove()
      container.appendChild(descriptions[newIndex])
      currentIndex = newIndex
    }
  }
})()
