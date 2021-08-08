import { MIDI } from '../core'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { tw } from 'twind'

const clampRoundPitch = (x: number) =>
  Math.max(0, Math.min(0x3fff, Math.round(x)))

export function Gyrocon() {
  const [text, setText] = useState('...')
  const [pitch, setPitch] = useState(0x2000)
  const pitchRef = useRef(pitch)
  const divRef = useRef<HTMLDivElement>(null)
  const [down, setDown] = useState(false)
  const downRef = useRef(down)
  useEffect(() => {
    MIDI.send([0xe0, pitch & 0x7f, pitch >> 7])
    pitchRef.current = pitch
  }, [pitch])
  useEffect(() => {
    downRef.current = down
    if (!down) {
      const interval = setInterval(() => {
        if (document.pointerLockElement) {
          setPitch((p) => {
            const oldOffset = p - 0x2000
            const newOffset = oldOffset * 0.9
            const newPitch = clampRoundPitch(newOffset + 0x2000)
            return newPitch
          })
        }
      })
      return () => clearInterval(interval)
    }
  }, [down])
  useEffect(() => {
    MIDI.send([0xb0, 101, 0])
    MIDI.send([0xb0, 100, 0])
    MIDI.send([0xb0, 6, 2])
    MIDI.send([0xb0, 38, 0])
    const listener = (e: DeviceOrientationEvent) => {
      const beta = e.beta || 0
      const threshold = 2.5
      const range = 10
      const x =
        beta > threshold
          ? beta - threshold
          : beta < -threshold
          ? beta + threshold
          : 0
      const pitch =
        0x2000 + Math.round(Math.max(-1, Math.min(1, x / -range)) * 0x1fff)
      setText(`${beta.toFixed(2)}`)
      setPitch(pitch)
    }
    window.addEventListener('deviceorientation', listener)
    return () => {
      window.removeEventListener('deviceorientation', listener)
    }
  }, [])
  return useMemo(() => {
    const x = ((pitch - 8192) / 8192) * -50 + 50
    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      setDown(true)
    }
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (document.pointerLockElement && downRef.current) {
        setPitch((p) => {
          return clampRoundPitch(p + e.movementY * -100)
        })
      }
    }
    const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      setDown(false)
    }
    return (
      <div className={tw`absolute inset-0 overflow-hidden`}>
        <div
          className={tw`absolute inset-0`}
          style={{ transform: `translate3d(0, ${x}%, 0)` }}
          ref={divRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onDoubleClick={() => divRef.current?.requestPointerLock()}
        >
          <div
            className={tw`flex items-center justify-center inset-x-0 top-0 h-[64px] bg-#090807`}
            style={{ transform: `translate3d(0, ${-x}%, 0)` }}
          >
            <div className={tw`text-3xl pre-wrap`}>{text}</div>
          </div>
        </div>
      </div>
    )
  }, [text, pitch])
}
