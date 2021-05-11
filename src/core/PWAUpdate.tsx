import { action, observable, runInAction } from 'mobx'
import { Observer } from 'mobx-react'
import React from 'react'
import { ReactNode } from 'react'

type UpdateNeeded = {
  reload: () => void
} | null

const state = observable({
  updateNeeded: null as UpdateNeeded,
})

export const registerUpdate = action('registerUpdate', (reload: () => void) => {
  state.updateNeeded = { reload }
})

export function PWAUpdateConnector(props: {
  children: (updateNeeded: UpdateNeeded) => ReactNode
}) {
  return <Observer>{() => <>{props.children(state.updateNeeded)}</>}</Observer>
}
