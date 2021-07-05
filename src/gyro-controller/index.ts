import { createFeature } from '../core'
import { Gyrocon } from './Gyrocon'

export default createFeature({
  name: 'gyro-controller',
  category: 'instruments',
  description: 'Use gyroscope to send MIDI control message.',
  instruments: [
    {
      id: 'gyrocon',
      sortKey: '402_gyrocon',
      name: 'Gyrocon',
      description:
        'A gyroscope-activated controller. Right now it only does pitch bending.',
      component: Gyrocon as any,
    },
  ],
})
