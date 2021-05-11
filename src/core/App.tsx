import './App.css'

import MainView from './MainView'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Feature } from './types'
import AppConfigurationProvider from './AppConfigurationProvider'
import { tw } from 'twind'
import AppStoreProvider, { useAppStore } from './AppStoreProvider'
import { AppSettingsPopover } from './AppSettingsPopover'
import { PWAUpdateConnector } from './PWAUpdate'

export function App({ features }: { features: Feature[] }) {
  return (
    <HashRouter>
      <AppConfigurationProvider features={features}>
        <AppStoreProvider features={features}>
          <div className={tw`absolute inset-0 overflow-hidden leading-tight`}>
            <header
              className={tw`absolute top-0 inset-x-0 h-[40px] bg-#090807 border-b border-#454443 z-10 flex items-center`}
            >
              <h1 className={tw`text-#8b8685 font-bold ml-2`}>
                <PWAUpdateConnector>
                  {(updateNeeded) =>
                    updateNeeded ? (
                      <button
                        className={tw`cursor-pointer text-yellow-300`}
                        onClick={() => updateNeeded.reload()}
                      >
                        New version available — click to update
                      </button>
                    ) : (
                      <>WebMIDICon</>
                    )
                  }
                </PWAUpdateConnector>
              </h1>
              <aside className={tw`absolute inset-y-0 right-2 flex`}>
                <AppSettingsPopover />
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
