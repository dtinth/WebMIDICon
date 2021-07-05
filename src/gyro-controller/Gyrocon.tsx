import { MIDI } from '../core'

import React, { useEffect, useMemo, useState } from 'react'
import { tw } from 'twind'

export function Gyrocon() {
  const [text, setText] = useState('...')
  const [pitch, setPitch] = useState(0x2000)
  useEffect(() => {
    MIDI.send([0xe0, pitch & 0x7f, pitch >> 7])
  }, [pitch])
  useEffect(() => {
    MIDI.send([0xb0, 101, 0])
    MIDI.send([0xb0, 100, 0])
    MIDI.send([0xb0, 6, 2])
    MIDI.send([0xb0, 38, 0])
    const listener = (e: DeviceOrientationEvent) => {
      const beta = e.beta || 0
      const threshold = 2.5
      const range = 10
      // setText([e.alpha, e.beta, e.gamma].map((x) => x?.toFixed(2)).join(' '))
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

      // var gamma = e.rotationRate.gamma
      // if (gamma > 10) {
      //   runtime.setButton(runtime.ccw)
      //   hp = 1
      // } else if (gamma < -10) {
      //   runtime.setButton(runtime.cw)
      //   hp = 1
      // } else if (Math.abs(gamma) < 3 && hp < 0.9) {
      //   runtime.setButton(null)
      // }
      // var now = Date.now()
      // hp *= Math.exp((now - lastTime) * -1e-3)
      // lastTime = now
    }
    window.addEventListener('deviceorientation', listener)
    return () => {
      window.removeEventListener('deviceorientation', listener)
    }
  }, [])
  return useMemo(() => {
    const x = ((pitch - 8192) / 8192) * -50 + 50
    return (
      <div className={tw`absolute inset-0 overflow-hidden`}>
        <div
          className={tw`absolute inset-0`}
          style={{ transform: `translate3d(0, ${x}%, 0)` }}
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
