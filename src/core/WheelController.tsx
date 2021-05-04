import React, { useCallback, useEffect, useRef } from 'react'
import { useObserver } from 'mobx-react'
import { Store } from './types'
import { tw } from 'twind'
import { TouchAbsorber } from './TouchAbsorber'

type Props = {
  registerWheelListener: (listener: (e: WheelEvent) => void) => () => void
  store: Store
}

export default function WheelController(props: Props) {
  const wheelValue = useRef(0)
  const sliderDiv = useRef<HTMLDivElement>(null)
  const { registerWheelListener, store } = props
  const velocity = useObserver(() => props.store.noteVelocity)

  const updateWheel = useCallback(
    (amount: number) => {
      const clamp = (x: number, l: number, u: number) => {
        return Math.max(l, Math.min(u, x))
      }
      wheelValue.current += amount
      let delta = 0
      if (Math.abs(wheelValue.current) >= 1) {
        delta =
          Math.floor(Math.abs(wheelValue.current)) *
          Math.sign(wheelValue.current)
        wheelValue.current -= delta
      }
      if (delta !== 0) {
        store.noteVelocity = clamp(store.noteVelocity + delta, 0, 127)
      }
    },
    [store]
  )

  useEffect(() => {
    return registerWheelListener((e) => {
      updateWheel(e.deltaX / 16)
    })
  }, [registerWheelListener, updateWheel])

  const xsRef = useRef<Record<number, { x: number; id: number }>>({})
  const updateTouches = (e: React.TouchEvent) => {
    const xs = xsRef.current
    const activeTouchIds = new Set<number>()
    for (const touch of Array.from(e.touches)) {
      const touchId = touch.identifier
      activeTouchIds.add(touchId)
      if (xs[touchId] == null) {
        xs[touchId] = { x: touch.clientX, id: touchId }
      } else if (sliderDiv.current) {
        const change = touch.clientX - xs[touchId].x
        const amount = change / sliderDiv.current.offsetWidth
        updateWheel(amount * 127)
        xs[touchId].x = touch.clientX
      }
    }
    for (const activeTouch of Object.values(xs)) {
      if (!activeTouchIds.has(activeTouch.id)) {
        delete xs[activeTouch.id]
      }
    }
  }

  return (
    <TouchAbsorber>
      <div
        className={tw`flex absolute inset-0`}
        onTouchStart={updateTouches}
        onTouchMove={updateTouches}
        onTouchEnd={updateTouches}
      >
        <div
          className={tw`mx-4 font-bold text-sm uppercase self-center text-#8b8685`}
        >
          Velocity ({velocity})
        </div>
        <div style={{ flex: 1 }} ref={sliderDiv}>
          <div
            style={{
              height: '100%',
              background: '#555',
              width: `${(velocity * 100) / 127}%`,
            }}
          />
        </div>
      </div>
    </TouchAbsorber>
  )
}
