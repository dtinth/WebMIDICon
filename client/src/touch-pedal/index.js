import { Pedal } from './Pedal'

export default {
  name: 'touch-pedal',
  category: 'instruments',
  description: 'A touchscreen-activated pedal.',
  instruments: [
    {
      id: 'pedal',
      sortKey: '401_pedal',
      name: 'iPedal',
      description: 'A touchscreen-activated pedal.',
      component: Pedal,
    },
  ],
}
