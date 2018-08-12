import { IsomorphicKeyboard } from './IsomorphicKeyboard'
import React from 'react'

export default {
  instruments: [
    {
      id: 'jammer',
      name: 'Jammer',
      description:
        'A isomorphic keyboard with the Jammer (Wicki-Hayden) key layout.',
      component: ({ store }) => (
        <IsomorphicKeyboard type="jammer" store={store} />
      ),
    },
    {
      id: 'sonome',
      name: 'Sonome',
      description:
        'A isomorphic keyboard with the Sonome (harmonic table) key layout.',
      component: ({ store }) => (
        <IsomorphicKeyboard type="harmonic" store={store} />
      ),
    },
  ],
}
