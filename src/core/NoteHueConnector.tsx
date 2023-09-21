import React, { ReactNode } from 'react'
import { useConfiguration } from './AppConfigurationHooks'

export interface NoteHueConnector {
  note: number
  children: (hue: number) => ReactNode
}

export function NoteHueConnector(props: NoteHueConnector) {
  const config = useConfiguration('appearance.colorMode')
  const shift = config.value === 'classic' ? 0 : 3
  const hue = (((props.note + shift) * 360) / 12) % 360
  return <>{props.children(hue)}</>
}
