import React from 'react'
import { observer } from 'mobx-react'
import styled from 'react-emotion'

const noteNames = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
]

function cancelEvent(e) {
  e.preventDefault()
  e.stopPropagation()
}

export class BeginnerChordMachine extends React.PureComponent {
  render() {
    const store = this.props.store
    return (
      <div
        className="BeginnerChordMachine"
        onTouchStart={cancelEvent}
        onTouchMove={cancelEvent}
        onTouchEnd={cancelEvent}
        style={{ left: 0, top: 0, bottom: 0, right: 0, position: 'absolute' }}
      >
        <div style={{ left: '50%', top: '50%', position: 'absolute' }}>
          <KeyIndicator store={store} />
          <Circle
            store={store}
            v={[0, 16, 19]}
            n={1}
            x={-2}
            y={1}
            text="I"
            fn="tonic"
            q=""
          />
          <Circle
            store={store}
            v={[2, 17, 21]}
            n={2}
            x={0}
            y={1}
            text="ii"
            fn="subdominant"
            q="m"
          />
          <Circle
            store={store}
            v={[4, 19, 23]}
            n={3}
            x={2}
            y={1}
            text="iii"
            fn="tonic"
            q="m"
          />
          <Circle
            store={store}
            v={[5, 12, 21]}
            n={4}
            x={-3}
            y={-1}
            text="IV"
            fn="subdominant"
          />
          <Circle
            store={store}
            v={[7, 14, 23]}
            n={5}
            x={-1}
            y={-1}
            text="V"
            fn="dominant"
          />
          <Circle
            store={store}
            v={[9, 16, 24]}
            n={6}
            x={1}
            y={-1}
            text="vi"
            fn="tonic"
            q="m"
          />
          <Circle
            store={store}
            v={[-1, 14, 17]}
            n={7}
            x={3}
            y={-1}
            text="vii°"
            fn="dominant"
            q="dim"
          />
        </div>
      </div>
    )
  }
}

const CircleElement = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  border: 3px solid #8b8685;
  border-radius: 100%;
`

const CircleOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const KeyIndicatorText = styled('div')`
  position: absolute;
  top: -220px;
  left: -200px;
  width: 400px;
  text-align: center;
  color: #8b8685;
`

const KeyIndicator = observer(function KeyIndicator(props) {
  const { store } = props
  const keyText = [
    noteNames[(144 + store.transpose) % 12],
    ' major · ',
    noteNames[(144 + store.transpose + 9) % 12],
    ' minor',
  ].join('')
  return (
    <KeyIndicatorText>
      <strong>Key:</strong> {keyText}
    </KeyIndicatorText>
  )
})

const Circle = observer(
  class Circle extends React.PureComponent {
    state = { active: false }
    onTouchStart = e => {
      cancelEvent(e)
      this.props.store.handleTouches([...this.props.v])
      this.setState({ active: true })
    }
    onTouchEnd = e => {
      cancelEvent(e)
      this.props.store.handleTouches([])
      this.setState({ active: false })
    }
    render() {
      const transpose = this.props.store.transpose
      const trueNoteValue = transpose + this.props.v[0]
      const hint = noteNames[(144 + trueNoteValue) % 12]
      const size = 160
      const spacing = 192
      const left = this.props.x * (spacing / 2)
      const top = this.props.y * (spacing / 2) * Math.sin(Math.PI / 3)
      const fnHue =
        this.props.fn === 'dominant'
          ? 0
          : this.props.fn === 'subdominant'
            ? 240
            : 120
      return (
        <div
          style={{
            position: 'absolute',
            left: left - size / 2,
            top: top - size / 2,
            width: size,
            height: size,
          }}
        >
          <CircleElement
            onTouchStart={this.onTouchStart}
            onTouchEnd={this.onTouchEnd}
            style={{
              borderColor: `hsl(${(trueNoteValue % 12) * 30},50%,72%)`,
            }}
          />
          <CircleOverlay>
            <div style={{ fontSize: 32, color: `hsl(${fnHue},50%,72%)` }}>
              {this.props.text}
            </div>
            <div style={{ color: `#8b8685`, marginTop: 5 }}>
              {hint}
              {this.props.q}
            </div>
          </CircleOverlay>
          <CircleElement
            style={{
              borderColor: 'white',
              background: `hsl(${(trueNoteValue % 12) * 30},50%,72%)`,
              pointerEvents: 'none',
              opacity: this.state.active ? 1 : 0,
            }}
          />
        </div>
      )
    }
  }
)
