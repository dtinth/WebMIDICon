import styled from 'react-emotion'

import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { TouchAbsorber } from '../core/TouchAbsorber'
import { NoteHueConnector } from '../core/NoteHueConnector'

const PianoKeyboardWrapper = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const PianoKeyboardKeyHolder = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
`

const PianoKeyboardKey = styled('div')`
  & .white {
    position: absolute;
    background: #8b8685;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 2px solid #b9b8b7;
    border-bottom-color: #090807;
    border-right-color: #090807;
    z-index: 1;
  }

  & .black {
    position: absolute;
    background: #252423;
    top: 0;
    bottom: 50%;
    left: 60%;
    width: 80%;
    border: 2px solid #b9b8b7;
    border-bottom-color: #090807;
    border-right-color: #090807;
    z-index: 2;
  }

  & .black.is-active,
  & .white.is-active {
    pointer-events: none;
    border-color: white black black white;
  }
`

export class PianoKeyboard extends React.PureComponent {
  constructor(props) {
    super(props)
    this.keys = {}
    this.keyMap = new WeakMap()
  }
  render() {
    return (
      <TouchAbsorber>
        <PianoKeyboardWrapper
          onTouchStart={this.handleTouch}
          onTouchMove={this.handleTouch}
          onTouchEnd={this.handleTouch}
          className="PianoKeyboard"
        >
          {this.renderRow(0, 24)}
          {this.renderRow(1, 12)}
          {this.renderRow(2, 0)}
        </PianoKeyboardWrapper>
      </TouchAbsorber>
    )
  }
  renderRow(position, keyShift) {
    const gutterSize = 0.04
    return (
      <div
        style={{
          position: 'absolute',
          top: percent(gutterSize + (position / 3) * (1 - gutterSize)),
          right: '3%',
          height: percent((1 - gutterSize) / 3 - gutterSize),
          left: '3%',
        }}
      >
        <Octave
          keyShift={keyShift}
          store={this.props.store}
          refKey={(noteValue, element) => {
            this.handleKeyRef(noteValue, position, element)
          }}
        />
      </div>
    )
  }
  handleTouch = (e) => {
    const keys = new Set()
    void [].forEach.call(e.touches, (touch) => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY)
      const matching = this.keyMap.get(element)
      if (matching != null) {
        keys.add(matching)
      }
    })
    this.props.store.handleTouches([...keys])
  }
  handleKeyRef(keyId, row, element) {
    const current = this.keys[keyId] || (this.keys[keyId] = {})
    current[row] = element
    if (element) this.keyMap.set(element, keyId)
  }
}

export class Octave extends React.Component {
  render() {
    return (
      <div>
        {this.renderKeySet(0, 5, true)}
        {this.renderKeySet(1, 7, true)}
        {this.renderKeySet(2, 9, true)}
        {this.renderKeySet(3, 11, false)}
        {this.renderKeySet(4, 12, true)}
        {this.renderKeySet(5, 14, true)}
        {this.renderKeySet(6, 16, false)}
        {this.renderKeySet(7, 17, true)}
        {this.renderKeySet(8, 19, true)}
        {this.renderKeySet(9, 21, true)}
        {this.renderKeySet(10, 23, false)}
        {this.renderKeySet(11, 24, true)}
        {this.renderKeySet(12, 26, true)}
        {this.renderKeySet(13, 28, false)}
      </div>
    )
  }
  renderKeySet(position, note, hasBlackKey) {
    const whiteNoteValue = note + this.props.keyShift
    const blackNoteValue = whiteNoteValue + 1
    return (
      <PianoKeyboardKeyHolder
        style={{ left: percent(position / 14), width: percent(1 / 14) }}
      >
        {this.renderKey('white', whiteNoteValue)}
        {hasBlackKey && this.renderKey('black', blackNoteValue)}
      </PianoKeyboardKeyHolder>
    )
  }
  renderKey(keyColor, noteValue) {
    return (
      <Key
        store={this.props.store}
        keyColor={keyColor}
        noteValue={noteValue}
        refKey={(element) => this.props.refKey(noteValue, element)}
      />
    )
  }
}

const Key = observer(
  class Key extends React.Component {
    constructor(props) {
      super(props)
      this.isTouched = computed(() =>
        this.props.store.activeNotes.has(this.props.noteValue)
      )
    }
    render() {
      const active = this.isTouched.get()
      const transpose = this.props.store.transpose
      const trueNoteValue = transpose + this.props.noteValue
      return (
        <PianoKeyboardKey>
          <div className={this.props.keyColor} ref={this.props.refKey} />
          <NoteHueConnector note={trueNoteValue}>
            {(hue) => (
              <div
                className={this.props.keyColor + ' is-active'}
                style={{
                  opacity: active ? 1 : 0,
                  background: `hsl(${hue},100%,90%)`,
                  transition: active ? '' : '0.3s opacity',
                }}
              />
            )}
          </NoteHueConnector>
        </PianoKeyboardKey>
      )
    }
  }
)

function percent(x) {
  return (x * 100).toFixed(6) + '%'
}
