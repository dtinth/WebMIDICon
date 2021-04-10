import React from 'react'
import { Feature, Store } from './types'

export function AppServices(props: { features: Feature[]; store: Store }) {
  return (
    <>
      {props.features.map((f, index) => {
        const Component = f.serviceComponent
        return Component ? <Component key={index} store={props.store} /> : null
      })}
    </>
  )
}
