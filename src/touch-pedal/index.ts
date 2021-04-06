import { Pedal } from './Pedal'
import { createFeature } from '../core'

export default createFeature({
  name: 'touch-pedal',
  category: 'instruments',
  description: 'A touchscreen-activated pedal.',
  instruments: [
    {
      id: 'pedal',
      sortKey: '401_pedal',
      name: 'iPedal',
      description: 'A touchscreen-activated pedal.',
      component: Pedal as any,
    },
  ],
})
