import './App.css'

import * as MIDI from './MIDI'
import MainView from './MainView'
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'react-emotion'
import { HashRouter } from 'react-router-dom'

const MIDISettings = styled('button')`
  height: 30px;
  background: #252423;
  border: 1px solid #454443;
  color: #8b8685;
  font-family: inherit;
  font-size: 16px;
  margin: 0;
  display: block;
`

const Wrapper = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
`

const Header = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  height: 40px;
  left: 0;
  background: #090807;
  border-bottom: 1px solid #454443;
  line-height: 40px;
  z-index: 10;
`

const HeaderTitle = styled('div')`
  color: #8b8685;
  font-weight: bold;
  margin-left: 10px;
`

const HeaderRight = styled('div')`
  position: absolute;
  top: 0;
  right: 4px;
  bottom: 0;
  line-height: 40px;
`

const AppContent = styled('div')`
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
`

export function App({ features }) {
  return (
    <HashRouter>
      <Wrapper>
        <Header>
          <HeaderTitle>my web based instruments</HeaderTitle>
          <HeaderRight>
            <MIDIStatus />
          </HeaderRight>
        </Header>
        <AppContent>
          <MainView features={features} />
        </AppContent>
      </Wrapper>
    </HashRouter>
  )
}

const MIDIStatus = observer(
  class MIDIStatus extends React.Component {
    constructor(props) {
      super(props)
      this.state = { open: false }
    }
    handleToggle = () => {
      this.setState({ open: !this.state.open })
    }
    render() {
      return (
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            position: 'relative',
          }}
        >
          <MIDISettings onClick={this.handleToggle}>
            {MIDI.getStatus()}
          </MIDISettings>
          {this.renderSelector()}
        </div>
      )
    }
    renderSelector() {
      if (!this.state.open) return null
      return (
        <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <div style={{ position: 'absolute', top: -1, right: 0 }}>
            <div
              style={{
                background: '#090807',
                border: '1px solid #656463',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
              }}
            >
              {MIDI.getOutputs().map(output => {
                return (
                  <div key={output.key}>
                    <button
                      style={{
                        font: 'inherit',
                        color: 'inherit',
                        border: 0,
                        margin: 0,
                        padding: '4px 6px',
                        background: 'transparent',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        MIDI.selectOutput(output.key)
                      }}
                    >
                      {output.name}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }
  }
)
