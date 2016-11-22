import './IsomorphicKeyboard.css'

import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'

export class IsomorphicKeyboard extends React.PureComponent {
  constructor (props) {
    super(props)
    this.keys = [ ]
    this.state = { keyElements: null }
  }
  componentDidMount () {
    this.handleSizeChange()
    window.addEventListener('resize', this.handleSizeChange)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleSizeChange)
  }
  handleContainerRef = (container) => {
    this.container = container
  }
  handleSizeChange = () => {
    if (this.container) {
      this.setState({
        keyElements: this.renderKeys(
          this.container.offsetWidth,
          this.container.offsetHeight
        )
      })
    }
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
          className='IsomorphicKeyboardのcircle'
          style={{
            borderColor: `hsl(${(noteValue % 12) * 30},50%,72%)`
          }}
        />
        <div
          className='IsomorphicKeyboardのcircle is-active'
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

export default IsomorphicKeyboard
