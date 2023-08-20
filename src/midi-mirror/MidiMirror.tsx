import { MIDI } from '../core'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { tw } from 'twind'

export function MidiMirror() {
  const [text, setText] = useState('...')
  return (
    <div className={tw`absolute inset-0 flex flex-col justify-center text-center`}>
          <div className={tw`text-3xl pre-wrap`}>{text}</div>
    </div>
  )
}
