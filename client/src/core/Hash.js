import { observable, action } from 'mobx'

const hash = observable(String(window.location.hash))

export function getHash() {
  return hash.get()
}

window.onhashchange = action('Hash change', function(e) {
  hash.set(window.location.hash)
})
