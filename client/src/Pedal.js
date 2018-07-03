import * as MIDI from './MIDI'

import React from 'react'

export class Pedal extends React.PureComponent {
  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
  _touchPressure = 0
  _mousePressure = 0
  _keyPressure = 0
  handleKeyDown = (e) => {
    if (e.which === 32) {
      this._keyPressure = 2
      this.updatePressure()
    }
  }
  handleKeyUp = (e) => {
    if (e.which === 32) {
      this._keyPressure = 0
      this.updatePressure()
    }
  }
  render () {
    return (
      <div
        onTouchStart={this.handleTouch}
        onTouchMove={this.handleTouch}
        onTouchEnd={this.handleTouch}
        onMouseDown={this.handleMouseDown}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: '20vw', fontWeight: 'bold' }}>iPedal</div>
        <div
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'white' }}
          ref={(div) => { this.div = div }}
        />
      </div>
    )
  }
  handleTouch = (e) => {
    const pressure = e.touches.length
    this._touchPressure = pressure
    this.updatePressure()
    e.preventDefault()
  }
  handleMouseDown = () => {
    this._mousePressure = 2
    this.updatePressure()
    const handleMouseUp = () => {
      this._mousePressure = 0
      this.updatePressure()
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mouseup', handleMouseUp)
  }
  updatePressure () {
    const pressure = this._touchPressure + this._keyPressure + this._mousePressure
    const opacity = Math.pow(pressure / 11, 1 / 3)
    if (this.div) {
      this.div.style.opacity = opacity
    }
    if (this._pressure <= 1 && pressure > 1) {
      MIDI.send([ 0xB0, 0x40, 127 ])
    }
    if (this._pressure > 1 && pressure <= 1) {
      MIDI.send([ 0xB0, 0x40, 0 ])
    }
    this._pressure = pressure
  }
}

export default Pedal
