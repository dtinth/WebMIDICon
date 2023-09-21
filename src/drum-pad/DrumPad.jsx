import React from 'react'
import { TouchAbsorber } from '../core/TouchAbsorber'
import { DrumButtonMapping } from './DrumButtonMapping'
import { NoteHueConnector } from '../core/NoteHueConnector'

export class DrumPadContents extends React.PureComponent {
  render() {
    return (
      <div
        onTouchStart={(e) => e.preventDefault()}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <div
          style={{ position: 'absolute', top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <DrumButtonMapping>
            {(buttons) =>
              buttons.map((button, index) => this.renderButton(button, index))
            }
          </DrumButtonMapping>
        </div>
      </div>
    )
  }
  renderButton(button, index) {
    const top = Math.floor(index / 4) * 25 + '%'
    const left = (index % 4) * 25 + '%'
    const width = '25%'
    const height = '25%'
    const background = `hsl(${button.note * 15}, 20%, 30%)`
    const backgroundActive = `hsl(${button.note * 15}, 40%, 90%)`
    return (
      <div style={{ position: 'absolute', top, left, width, height }}>
        <DrumButton
          background={background}
          backgroundActive={backgroundActive}
          name={button.name}
          onTrigger={(velocity) => this.props.onTrigger(button.note, velocity)}
        />
      </div>
    )
  }
}

const DrumButton = class DrumButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.touchId = 0
  }
  render() {
    const { background, backgroundActive, name } = this.props
    return (
      <TouchAbsorber>
        <div
          onTouchStart={this.handleTouchStart}
          onContextMenu={this.onContextMenu}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            transform: 'translateZ(0)',
            '-moz-user-select': 'none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            'user-select': 'none',
          }}
          ref={this.registerTouchElement}
        >
          <div
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              bottom: 2,
              left: 2,
              background,
              transform: 'translateZ(0)',
            }}
          />
          <div
            ref={this.registerActiveElement}
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
              bottom: 1,
              left: 1,
              background: backgroundActive,
              transform: 'translateZ(0)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translateZ(0)',
            }}
          >
            <div style={{ fontSize: '3vw' }}>{name}</div>
          </div>
        </div>
      </TouchAbsorber>
    )
  }
  registerTouchElement = (element) => {
    this.element = element
  }
  registerActiveElement = (element) => {
    this.activeElement = element
    if (element) {
      element.style.opacity = '0'
    }
  }

  onContextMenu = (e) => {
    e.preventDefault()
  }

  handleTouchStart = (e) => {
    if (!this.element) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const rect = this.element.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width
    const y = (touch.clientY - rect.top) / rect.height
    const velocity = 1 - 2 * (Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2))
    this.props.onTrigger(velocity)
    if (!this.activeElement) return
    const touchId = ++this.touchId
    this.activeElement.style.opacity = velocity
    setTimeout(() => {
      if (touchId !== this.touchId) return
      if (!this.activeElement) return
      this.activeElement.style.opacity = '0'
    }, 50)
  }
}
