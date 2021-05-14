import React from 'react'
import { Feature, Store } from './types'
import { ErrorBoundary } from 'react-error-boundary'
import { StatusBarItem } from './StatusBar'
import { tw } from 'twind'

export function AppServices(props: { features: Feature[]; store: Store }) {
  return (
    <>
      {props.features.map((f, index) => {
        const Component = f.serviceComponent
        return Component ? (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorView
                thing={f.name}
                error={error}
                onReset={resetErrorBoundary}
              />
            )}
          >
            <Component key={index} store={props.store} />
          </ErrorBoundary>
        ) : null
      })}
    </>
  )
}

function ErrorView(props: {
  thing: string
  error: Error
  onReset: () => void
}) {
  const { thing, onReset, error } = props
  return (
    <StatusBarItem id={'error_' + thing}>
      <button
        onClick={() => {
          if (
            confirm(
              `${thing} service failed: ${
                (error && error.stack) || error
              }\n\nRestart this component?`
            )
          ) {
            onReset()
          }
        }}
        className={tw`cursor-pointer text-[#ffaaaa]`}
      >
        {thing} service failed
      </button>
    </StatusBarItem>
  )
}
