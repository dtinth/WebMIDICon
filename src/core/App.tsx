import './App.css'

import * as MIDI from './MIDI'
import MainView from './MainView'
import React, { useState } from 'react'
import { Observer } from 'mobx-react'
import styled from 'react-emotion'
import { HashRouter } from 'react-router-dom'
import { Feature } from './types'
import AppConfigurationProvider from './AppConfigurationProvider'
import { tw } from 'twind'
import AppStoreProvider, { useAppStore } from './AppStoreProvider'

const MIDISettings = styled('button')`
  height: 30px;
  background: #252423;
  border: 1px solid #454443;
  color: #8b8685;
  font-family: inherit;
  line-height: 1;
  font-size: 16px;
  margin: 0;
  display: block;
`

export function App({ features }: { features: Feature[] }) {
  return (
    <HashRouter>
      <AppConfigurationProvider features={features}>
        <AppStoreProvider features={features}>
          <div className={tw`absolute inset-0 overflow-hidden leading-tight`}>
            <header
              className={tw`absolute top-0 inset-x-0 height-[40px] bg-#090807 border-b border-#454443 leading-[40px] z-10`}
            >
              <h1 className={tw`text-#8b8685 font-bold ml-2`}>WebMIDICon</h1>
              <aside className={tw`absolute inset-y-0 right-2`}>
                <MIDIStatus />
              </aside>
            </header>
            <section className={tw`absolute top-[40px] inset-x-0 bottom-0`}>
              <MainViewContainer features={features} />
            </section>
          </div>
        </AppStoreProvider>
      </AppConfigurationProvider>
    </HashRouter>
  )
}

function MainViewContainer(props: { features: Feature[] }) {
  const store = useAppStore()
  return <MainView features={props.features} store={store} />
}

function MIDIStatus() {
  const [open, setOpen] = useState(false)
  const handleToggle = () => setOpen((o) => !o)
  const handleOutputSelect = (key: string) => MIDI.selectOutput(key)
  const renderSelector = () =>
    !!open && (
      <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <div style={{ position: 'absolute', top: -1, right: 0 }}>
          <Observer>
            {() => (
              <MIDIOutputList
                outputs={MIDI.getOutputs()}
                onOutputSelect={handleOutputSelect}
              />
            )}
          </Observer>
        </div>
      </div>
    )
  return (
    <div
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        position: 'relative',
      }}
    >
      <MIDISettings onClick={handleToggle}>
        <Observer>{() => <>{MIDI.getStatus()}</>}</Observer>
      </MIDISettings>
      {renderSelector()}
    </div>
  )
}

function MIDIOutputList(props: {
  outputs: MIDI.Output[]
  onOutputSelect: (key: string) => void
}) {
  return (
    <div
      style={{
        background: '#090807',
        border: '1px solid #656463',
        lineHeight: 1.25,
        whiteSpace: 'nowrap',
      }}
    >
      {props.outputs.map((output) => {
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
              onClick={() => props.onOutputSelect(output.key)}
            >
              {output.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}
