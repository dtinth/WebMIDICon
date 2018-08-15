import React from 'react'
import { Observer } from 'mobx-react'

export class MainToolbar extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <a
          ref={this.props.innerRef}
          href="#"
          style={{
            color: '#8b8685',
            display: 'block',
            marginLeft: 10,
            textDecoration: 'none',
          }}
        >
          &larr;
        </a>
        <Observer>
          {() => (
            <React.Fragment>
              <Title>Transpose</Title>
              {this.renderTransposeButton(-6)}
              {this.renderTransposeButton(-5)}
              {this.renderTransposeButton(-4)}
              {this.renderTransposeButton(-3)}
              {this.renderTransposeButton(-2)}
              {this.renderTransposeButton(-1)}
              {this.renderTransposeButton(0)}
              {this.renderTransposeButton(1)}
              {this.renderTransposeButton(2)}
              {this.renderTransposeButton(3)}
              {this.renderTransposeButton(4)}
              {this.renderTransposeButton(5)}
              {this.renderTransposeButton(6)}
            </React.Fragment>
          )}
        </Observer>

        <Observer>
          {() => (
            <React.Fragment>
              <Title>Octave</Title>
              {this.renderOctaveButton(0)}
              {this.renderOctaveButton(1)}
              {this.renderOctaveButton(2)}
              {this.renderOctaveButton(3)}
              {this.renderOctaveButton(4)}
              {this.renderOctaveButton(5)}
              {this.renderOctaveButton(6)}
            </React.Fragment>
          )}
        </Observer>
      </div>
    )
  }
  renderTransposeButton(n) {
    const store = this.props.store
    return (
      <Button
        width="1.3em"
        onTap={() => store.setTranspose(n)}
        selected={store.transpose === n}
      >
        {n}
      </Button>
    )
  }
  renderOctaveButton(n) {
    const store = this.props.store
    return (
      <Button
        width="1.2em"
        onTap={() => store.setOctave(n)}
        selected={store.octave === n}
      >
        {n}
      </Button>
    )
  }
}

const Title = props => (
  <div
    style={{
      marginLeft: 12,
      fontWeight: 'bold',
      fontSize: '0.8em',
      textTransform: 'uppercase',
      color: '#8b8685',
    }}
  >
    {props.children}
  </div>
)

const Button = props => (
  <div
    onTouchStart={e => {
      e.preventDefault()
      props.onTap()
    }}
    style={{
      marginLeft: 6,
      background: props.selected ? '#656463' : '#090807',
      color: props.selected ? '#e9e8e7' : '#8b8685',
      padding: '3px 4px',
      borderRadius: 4,
      width: props.width || 'auto',
      display: 'inline-block',
      textAlign: 'center',
    }}
  >
    {props.children}
  </div>
)

export default MainToolbar
