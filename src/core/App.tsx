import './App.css'

import MainView from './MainView'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Feature } from './types'
import AppConfigurationProvider from './AppConfigurationProvider'
import { tw } from 'twind'
import AppStoreProvider, { useAppStore } from './AppStoreProvider'
import { MIDIStatus } from './AppSettingsPopover'

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
