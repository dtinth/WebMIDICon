import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Observer } from 'mobx-react'
import { createFeature, StatusBarItem, Store } from '../core'

export default createFeature({
  name: 'chord-identifier',
  category: 'addons',
  description: 'Identify chords',
  instruments: [],
  serviceComponent: ChordIdentifierContainer,
})

function ChordIdentifierContainer(props: { store: Store }) {
  const [sharp11, setSharp11] = useState<
    typeof import('@dtinth/sharp11-browserified') | undefined
  >(undefined)
  useEffect(() => {
    import('@dtinth/sharp11-browserified').then((module) => {
      setSharp11(module)
    })
  }, [])
  return (
    <Observer>
      {() => (
        <ChordIdentifier
          activeNotes={[...props.store.activeNotes]
            .map((value) => value + props.store.transpose)
            .sort((a, b) => a - b)}
          sharp11={sharp11}
        />
      )}
    </Observer>
  )
}

function ChordIdentifier(props: {
  activeNotes: number[]
  sharp11: typeof import('@dtinth/sharp11-browserified') | undefined
}) {
  const activeNotes = useMemoizedArray(props.activeNotes)
  const sharp11 = props.sharp11
  const chord = useMemo(
    () =>
      activeNotes.length > 2
        ? sharp11?.chord.identifyArray(
            props.activeNotes.map((value) => sharp11.note.fromValue(value + 24))
          )
        : null,
    [activeNotes, sharp11]
  )
  useEffect(() => {
    console.log(chord)
  }, [chord])
  return chord ? <StatusBarItem id="chord">{chord}</StatusBarItem> : null
}

function useMemoizedArray(input: number[]) {
  const memo = useRef(input)
  if (input !== memo.current) {
    if (input.length !== memo.current.length) {
      memo.current = input
    } else {
      for (let i = 0; i < input.length; i++) {
        if (memo.current[i] !== input[i]) {
          memo.current = input
          break
        }
      }
    }
  }
  return memo.current
}
