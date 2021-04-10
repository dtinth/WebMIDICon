import { ComponentType, KeyboardEvent } from 'react'
import { ConfigurationSection } from '../configuration'

export interface Feature {
  name: string
  description: string
  category: 'instruments' | 'addons'
  instruments?: Instrument[]
  serviceComponent?: ComponentType<{ store: Store }>
  onKeyDown?: (store: Store, event: KeyboardEvent) => void
  onKeyUp?: (store: Store, event: KeyboardEvent) => void
  getActiveNotes?: () => ActiveNote[]
  configuration?: ConfigurationSection
}

export interface Instrument {
  id: string
  sortKey: string
  name: string
  description: string
  component: ComponentType<{ store: Store }>
}

export interface Store {
  touches: ActiveNote[]
  transpose: number
  octave: number
  noteVelocity: number
  setTranspose: (transpose: number) => void
  setOctave: (octave: number) => void
  handleTouches: (notes: ActiveNote[]) => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleKeyUp: (e: KeyboardEvent) => void
  activeNotes: Set<ActiveNote>
}

export type ActiveNote = number
