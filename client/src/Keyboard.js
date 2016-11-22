import './Keyboard.css'
import * as MIDI from './MIDI'

import React from 'react'
import { observable, action, computed, asMap, autorun } from 'mobx'
import { observer } from 'mobx-react'

const firstRow = [ 16, 90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 186, 191 ]
const secondRow = [ 9, 81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80, 219, 187, 221, 8, 220 ]

function createStore () {
  const store = observable({
    touches: [ ],
    keyCodes: asMap({ }),
    handleTouches: action('updateTouches', (touches) => {
      store.touches = touches
    }),
    handleKeyDown: action('handleKeyDown', (keyCode) => {
      store.keyCodes.set(keyCode, true)
    }),
    handleKeyUp: action('handleKeyUp', (keyCode) => {
      store.keyCodes.delete(keyCode)
    }),
    get activeNotes () {
      const set = new Set()
      for (const key of store.touches) {
        set.add(key)
      }
      for (const keyCode of store.keyCodes.keys()) {
        {
          const index = firstRow.indexOf(+keyCode)
          if (index > -1) {
            set.add(index + 11)
          }
        }
        {
          const index = secondRow.indexOf(+keyCode)
          if (index > -1) {
            set.add(index + 23)
          }
        }
      }
      return set
    }
  })
  return store
}

const handleNotes = (() => {
  let previous = new Set()
  return function (next) {
    for (const note of next) {
      if (!previous.has(note)) {
        MIDI.send([ 0x90, note + 32, 0x60 ])
      }
    }
    for (const note of previous) {
      if (!next.has(note)) {
        MIDI.send([ 0x80, note + 32, 0x60 ])
      }
    }
    previous = next
  }
})()

export class Keyboard extends React.Component {
  constructor (props) {
    super(props)
    this.store = createStore()
    autorun(() => {
      handleNotes(this.store.activeNotes)
    })
  }
  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
  shouldComponentUpdate () {
    return false
  }
  handleKeyDown = (e) => {
    this.store.handleKeyDown(e.keyCode)
    e.preventDefault()
  }
  handleKeyUp = (e) => {
    this.store.handleKeyUp(e.keyCode)
    e.preventDefault()
  }
  render () {
    return <PianoKeyboard store={this.store} />
    // return <IsomorphicKeyboard store={this.store} />
  }
}

export class IsomorphicKeyboard extends React.Component {
  constructor (props) {
    super(props)
    this.keys = [ ]
    this.state = { keyElements: null }
  }
  componentDidMount () {
    if (this.container) {
      this.setState({
        keyElements: this.renderKeys(
          this.container.offsetWidth,
          this.container.offsetHeight
        )
      })
    }
  }
  handleContainerRef = (container) => {
    this.container = container
  }
  renderKeys (width, height) {
    if (!width || !height) return null
    const keyDistance = Math.sqrt(
      width * width +
      height * height
    ) / 16
    const keySize = keyDistance * 0.67
    const xOffset = keyDistance * Math.sqrt(3) / 2
    const yOffset = keyDistance
    const x = (column) => keyDistance / 2 + column * xOffset
    const y = (column, row) => height - keyDistance / 2 + (column / 2 - row) * yOffset
    const out = [ ]
    this.keys.length = 0
    this.keyDistance = keyDistance
    for (let i = 0; x(i) <= width; i++) {
      for (let j = 0; y(i, j) >= 0; j++) {
        const cx = x(i)
        const cy = y(i, j)
        const noteValue = j * 7 - i * 3 // j + 3 * i
        if (cx < 0) continue
        if (cy > height) continue
        out.push(
          <Circle
            store={this.props.store}
            key={i + ':' + j}
            size={keySize}
            noteValue={noteValue}
            left={cx}
            top={cy}
          />
        )
        this.keys.push({ x: cx, y: cy, noteValue: noteValue })
      }
    }
    return out
  }
  updateTouches = (e) => {
    e.preventDefault()
    const container = this.container
    if (!container) return
    const bound = container.getBoundingClientRect()
    const bx = bound.left
    const by = bound.top
    const activated = new Set()
    void [ ].forEach.call(e.touches, (touch) => {
      const rankedKeys = (this.keys
        .map(({ noteValue, x, y }) => ({
          noteValue,
          distance: Math.sqrt(
            Math.pow(touch.clientX - (bx + x), 2) +
            Math.pow(touch.clientY - (by + y), 2)
          )
        }))
        .sort((a, b) => a.distance - b.distance)
      )
      const threshold = rankedKeys[0].distance + this.keyDistance / 8
      for (const { distance, noteValue } of rankedKeys) {
        if (distance > threshold) break
        activated.add(noteValue)
      }
    })
    this.props.store.handleTouches([ ...activated ])
  }
  render () {
    return (
      <div
        ref={this.handleContainerRef}
        onTouchStart={this.updateTouches}
        onTouchMove={this.updateTouches}
        onTouchEnd={this.updateTouches}
        style={{ position: 'absolute', overflow: 'hidden', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {this.state.keyElements}
      </div>
    )
  }
}

const Circle = observer(class Circle extends React.PureComponent {
  constructor (props) {
    super(props)
    this.isTouched = computed(() => this.props.store.activeNotes.has(this.props.noteValue))
  }
  render () {
    const { size, noteValue, left, top } = this.props
    return (
      <div
        style={{
          position: 'absolute',
          left: left - size / 2,
          top: top - size / 2,
          width: size,
          height: size
        }}
      >
        <div
          className='Keyboardのcircle'
          style={{
            borderColor: `hsl(${(noteValue % 12) * 30},50%,72%)`
          }}
        />
        <div
          className='Keyboardのcircle is-active'
          style={{
            borderColor: 'white',
            background: `hsl(${(noteValue % 12) * 30},50%,72%)`,
            opacity: this.isTouched.get() ? 1 : 0,
            transform: 'scale(' + (this.isTouched.get() ? 1 : 1.25) + ')',
            transition: this.isTouched.get() ? '' : '0.5s opacity, 0.5s transform'
          }}
        />
      </div>
    )
  }
})

export class PianoKeyboard extends React.Component {
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
      >
        <div className='Keyboardのrows'>
          {this.renderRow(0, 24)}
          {this.renderRow(1, 12)}
          {this.renderRow(2, 0)}
        </div>
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
        className='KeyboardのkeyHolder'
        style={{ left: percent(position / 14), width: percent(1 / 14) }}
      >
        {this.renderKey('Keyboardのkey', whiteNoteValue)}
        {hasBlackKey && this.renderKey('KeyboardのblackKey', blackNoteValue)}
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

export default Keyboard
