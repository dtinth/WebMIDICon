import './PianoKeyboard.css'

import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'

export class PianoKeyboard extends React.PureComponent {
  constructor (props) {
    super(props)
    this.keys = { }
    this.keyMap = new WeakMap()
  }
  render () {
    return (
      <div
        onTouchStart={this.handleTouch}
        onTouchMove={this.handleTouch}
        onTouchEnd={this.handleTouch}
        className='PianoKeyboard'
      >
        {this.renderRow(0, 24)}
        {this.renderRow(1, 12)}
        {this.renderRow(2, 0)}
      </div>
    )
  }
  renderRow (position, keyShift) {
    const gutterSize = 0.04
    return (
      <div
        style={{
          position: 'absolute',
          top: percent(gutterSize + position / 3 * (1 - gutterSize)),
          right: '3%',
          height: percent((1 - gutterSize) / 3 - gutterSize),
          left: '3%'
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
    void [ ].forEach.call(e.touches, (touch) => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY)
      const matching = this.keyMap.get(element)
      if (matching != null) {
        keys.add(matching)
      }
    })
    this.props.store.handleTouches([ ...keys ])
    e.preventDefault()
  }
  handleKeyRef (keyId, row, element) {
    const current = this.keys[keyId] || (this.keys[keyId] = { })
    current[row] = element
    if (element) this.keyMap.set(element, keyId)
  }
}

export class Octave extends React.Component {
  render () {
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
  renderKeySet (position, note, hasBlackKey) {
    const whiteNoteValue = note + this.props.keyShift
    const blackNoteValue = whiteNoteValue + 1
    return (
      <div
        className='PianoKeyboardのkeyHolder'
        style={{ left: percent(position / 14), width: percent(1 / 14) }}
      >
        {this.renderKey('PianoKeyboardのkey', whiteNoteValue)}
        {hasBlackKey && this.renderKey('PianoKeyboardのblackKey', blackNoteValue)}
      </div>
    )
  }
  renderKey (className, noteValue) {
    return (
      <Key
        store={this.props.store}
        className={className}
        noteValue={noteValue}
        refKey={(element) => this.props.refKey(noteValue, element)}
      />
    )
  }
}

const Key = observer(class Key extends React.PureComponent {
  constructor (props) {
    super(props)
    this.isTouched = computed(() => this.props.store.activeNotes.has(this.props.noteValue))
  }
  render () {
    const active = this.isTouched.get()
    return (
      <div>
        <div
          className={this.props.className}
          ref={this.props.refKey}
        />
        <div
          className={this.props.className + ' is-active'}
          style={{
            opacity: active ? 1 : 0,
            transition: active ? '' : '0.3s opacity'
          }}
        />
      </div>
    )
  }
})

function percent (x) {
  return (x * 100).toFixed(6) + '%'
}

export default PianoKeyboard
