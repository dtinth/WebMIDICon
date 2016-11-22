'use strict'

import { observable, action, asMap } from 'mobx'

const firstRow = [ 16, 90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 186, 191 ]
const secondRow = [ 9, 81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80, 219, 187, 221, 8, 220 ]

export function createStore () {
  const store = observable({
    touches: [ ],
    keyCodes: asMap({ }),
    handleTouches: action('updateTouches', (touches) => {
      store.touches = touches
    }),
    handleKeyDown: action('handleKeyDown', (keyCode) => {
      store.keyCodes.set(keyCode, true)
    }),
    handleKeyUp: action('handleKeyUp', (keyCode) => {
      store.keyCodes.delete(keyCode)
    }),
    get activeNotes () {
      const set = new Set()
      for (const key of store.touches) {
        set.add(key)
      }
      for (const keyCode of store.keyCodes.keys()) {
        {
          const index = firstRow.indexOf(+keyCode)
          if (index > -1) {
            set.add(index + 11)
          }
        }
        {
          const index = secondRow.indexOf(+keyCode)
          if (index > -1) {
            set.add(index + 23)
          }
        }
      }
      return set
    }
  })
  return store
}

export default createStore
