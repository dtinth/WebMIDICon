import React, { useEffect, useRef } from 'react'
import { useObserver } from 'mobx-react'
import { Store } from './types'

type Props = {
  registerWheelListener: (listener: (e: WheelEvent) => void) => () => void
  store: Store
}

export default function WheelController(props: Props) {
  const wheelValue = useRef(0)
  const { registerWheelListener } = props
  const velocity = useObserver(() => props.store.noteVelocity)
  useEffect(
    () => {
      return registerWheelListener(e => {
        const clamp = (x: number, l: number, u: number) => {
          return Math.max(l, Math.min(u, x))
        }
        wheelValue.current += e.deltaX / 16
        let delta = 0
        if (Math.abs(wheelValue.current) >= 1) {
          delta =
            Math.floor(Math.abs(wheelValue.current)) *
            Math.sign(wheelValue.current)
          wheelValue.current -= delta
        }
        props.store.noteVelocity = clamp(
          props.store.noteVelocity + delta,
          0,
          127
        )
      })
    },
    [registerWheelListener]
  )
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div
        style={{
          margin: '0 12px',
          fontWeight: 'bold',
          fontSize: '0.8em',
          textTransform: 'uppercase',
          color: '#8b8685',
          alignSelf: 'center',
        }}
      >
        Velocity ({velocity})
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: '100%',
            background: '#555',
            width: `${(velocity * 100) / 127}%`,
          }}
        />
      </div>
    </div>
  )
}
