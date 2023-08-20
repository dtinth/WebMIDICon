import React from 'react'
import { Observer } from 'mobx-react'
import { Store } from './types'

export interface MainToolbar {
  store: Store
  innerRef: React.RefObject<HTMLAnchorElement>
}

export function MainToolbar(props: MainToolbar) {
  const renderTransposeButton = (n: number) => {
    const store = props.store
    return (
      <ToolbarButton
        width="1.3em"
        onTap={() => store.setTranspose(n)}
        selected={store.transpose === n}
      >
        {n}
      </ToolbarButton>
    )
  }

  const renderOctaveButton = (n: number) => {
    const store = props.store
    return (
      <ToolbarButton
        width="1.2em"
        onTap={() => store.setOctave(n)}
        selected={store.octave === n}
      >
        {n}
      </ToolbarButton>
    )
  }

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
        ref={props.innerRef}
        href="#/"
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
            <ToolbarSectionTitle>Transpose</ToolbarSectionTitle>
            {renderTransposeButton(-6)}
            {renderTransposeButton(-5)}
            {renderTransposeButton(-4)}
            {renderTransposeButton(-3)}
            {renderTransposeButton(-2)}
            {renderTransposeButton(-1)}
            {renderTransposeButton(0)}
            {renderTransposeButton(1)}
            {renderTransposeButton(2)}
            {renderTransposeButton(3)}
            {renderTransposeButton(4)}
            {renderTransposeButton(5)}
            {renderTransposeButton(6)}
          </React.Fragment>
        )}
      </Observer>

      <Observer>
        {() => (
          <React.Fragment>
            <ToolbarSectionTitle>Octave</ToolbarSectionTitle>
            {renderOctaveButton(0)}
            {renderOctaveButton(1)}
            {renderOctaveButton(2)}
            {renderOctaveButton(3)}
            {renderOctaveButton(4)}
            {renderOctaveButton(5)}
            {renderOctaveButton(6)}
          </React.Fragment>
        )}
      </Observer>
    </div>
  )
}

interface ToolbarSectionTitle {
  children: React.ReactNode
}

const ToolbarSectionTitle = (props: ToolbarSectionTitle) => (
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

interface ToolbarButton {
  onTap: () => void
  selected?: boolean
  width?: string
  children: React.ReactNode
}

const ToolbarButton = (props: ToolbarButton) => (
  <div
    onTouchStart={(e) => {
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
