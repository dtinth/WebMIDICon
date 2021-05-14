import { observable } from 'mobx'
import { Observer } from 'mobx-react'
import React, { Fragment, ReactNode, useEffect } from 'react'
import { tw } from 'twind'

const status = observable.map<string, ReactNode>({}, { deep: false })

export function StatusBar() {
  return (
    <div className={tw`flex flex-auto text-sm text-#8b8685`}>
      <Observer>
        {() => (
          <>
            {[...status].map(([k, v]) => (
              <StatusBarItemView key={k}>{v}</StatusBarItemView>
            ))}
          </>
        )}
      </Observer>
      <div className={tw`flex-auto`}></div>
      <StatusBarItemView>WebMIDICon</StatusBarItemView>
    </div>
  )
}

function StatusBarItemView(props: { children: ReactNode }) {
  return (
    <div className={tw`px-2 flex items-center`}>
      <div>{props.children}</div>
    </div>
  )
}

export function StatusBarItem(props: { id: string; children: ReactNode }) {
  useEffect(() => {
    status.set(props.id, props.children)
    return () => {
      status.delete(props.id)
    }
  }, [props.id, props.children])
  return null
}
