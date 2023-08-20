import React, { useMemo } from 'react'
import { FC, ReactNode } from 'react'
import { useConfiguration } from '../core'

interface ButtonMapping {
  name: string
  note: number
}

const buttons: ButtonMapping[] = [
  { name: 'Ride Edge', note: 52 },
  { name: 'Ride Bell', note: 53 },
  { name: 'Cymbal 1', note: 57 },
  { name: 'Cymbal 2', note: 49 },

  { name: 'Hi Tom', note: 48 },
  { name: 'Mid Tom', note: 45 },
  { name: 'Low Tom', note: 41 },
  { name: 'Ride In', note: 59 },

  { name: 'Kick', note: 36 },
  { name: 'Snare', note: 38 },
  { name: 'Closed Hi-Hat', note: 42 },
  { name: 'Open Hi-Hat', note: 46 },

  { name: 'Kick', note: 36 },
  { name: 'Sidestick', note: 37 },
  { name: 'Kick', note: 36 },
  { name: 'Kick', note: 36 },
]

interface DrumButtonMapping {
  children: (buttons: ButtonMapping[]) => ReactNode
}

export const DrumButtonMapping: FC<DrumButtonMapping> = (props) => {
  const buttonOverride =
    useConfiguration<string>('drumPad.buttonOverride').value || ''
  const mappedButtons = useMemo(() => {
    const result = [...buttons]
    buttonOverride.replace(
      /(\d+)\s*=\s*(\d+)\s*,\s*([^;]+)/g,
      (_all, num, noteStr, name) => {
        const index = +num - 1
        const note = +noteStr
        console.log(index, note, name)
        if (index >= 0 && index < result.length && note > 0 && note < 128) {
          result[index] = { name, note }
        }
        return ''
      }
    )
    return result
  }, [buttons, buttonOverride])
  return <>{props.children(mappedButtons)}</>
}
