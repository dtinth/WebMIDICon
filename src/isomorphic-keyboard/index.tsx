import { IsomorphicKeyboard } from './IsomorphicKeyboard'
import React from 'react'
import { createFeature } from '../core'

export default createFeature({
  name: 'isomorphic-keyboard',
  category: 'instruments',
  description:
    'An isomorphic keyboard where each button has an consistent interval with adjacent keys. ' +
    'To learn more, see [Isomorphic keyboards](http://www.altkeyboards.com/instruments/isomorphic-keyboards).',
  instruments: [
    {
      id: 'jammer',
      sortKey: '301_jammer',
      name: 'Jammer',
      description:
        'A isomorphic keyboard with the Jammer (Wicki-Hayden) key layout.',
      component: ({ store }) => (
        <IsomorphicKeyboard type="jammer" store={store} />
      ),
    },
    {
      id: 'sonome',
      sortKey: '302_sonome',
      name: 'Sonome',
      description:
        'A isomorphic keyboard with the Sonome (harmonic table) key layout.',
      component: ({ store }) => (
        <IsomorphicKeyboard type="harmonic" store={store} />
      ),
    },
    {
      id: 'ccba',
      sortKey: '303_ccba',
      name: 'C-System',
      description:
        'A isomorphic keyboard with the C-System Chromatic Button Accordian layout.',
      component: ({ store }) => (
        <IsomorphicKeyboard type="ccba" store={store} />
      ),
    },
    {
      id: 'bcba',
      sortKey: '303_bcba',
      name: 'B-System',
      description:
        'A isomorphic keyboard with the B-System Chromatic Button Accordian layout.',
      component: ({ store }) => (
        <IsomorphicKeyboard type="bcba" store={store} />
      ),
    },
  ],
})
