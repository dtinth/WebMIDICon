import { MIDI } from '../core'

import React from 'react'
import { TouchAbsorber } from '../core/TouchAbsorber'

export class Pedal extends React.PureComponent {
  render() {
    return (
      <TouchAbsorber>
        <div
          onTouchStart={this.handleTouch}
          onTouchMove={this.handleTouch}
          onTouchEnd={this.handleTouch}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
              fontSize: '20vw',
              fontWeight: 'bold',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            iPedal
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'white',
            }}
            ref={(div) => {
              this.div = div
            }}
          />
        </div>
      </TouchAbsorber>
    )
  }
  handleTouch = (e) => {
    const pressure = e.touches.length
    const opacity = Math.pow(pressure / 11, 1 / 3)
    if (this.div) {
      this.div.style.opacity = opacity
    }
    if (!this._on && pressure >= 1) {
      MIDI.send([0xb0, 0x40, 127])
      this._on = true
    }
    if (this._on && pressure < 1) {
      MIDI.send([0xb0, 0x40, 0])
      this._on = false
    }
    e.preventDefault()
  }
}
