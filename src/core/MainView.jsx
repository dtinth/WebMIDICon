import * as MIDI from './MIDI'

import MainToolbar from './MainToolbar'
import React from 'react'
import createStore from './createStore'
import styled from 'react-emotion'
import { Switch, Route } from 'react-router-dom'
import { Observer } from 'mobx-react'
import { sortBy } from 'lodash'
import FeatureList from './FeatureList'
import WheelController from './WheelController'
import { AppConfigurationEditor } from './AppConfigurationEditor'

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    const { features } = props
    this.store = createStore(features)
    const instruments = sortBy(
      [].concat(...features.map((f) => f.instruments || [])),
      'sortKey'
    )
    console.log('Loaded instruments:', instruments)
    this.instruments = instruments
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleGlobalKeyDown, false)
    window.addEventListener('wheel', this.handleWheel, {
      passive: false,
    })
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleGlobalKeyDown, false)
    window.removeEventListener('wheel', this.handleWheel, {
      passive: false,
    })
  }
  handleGlobalKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (this.contentElement) this.contentElement.focus()
    }
  }
  handleKeyDown = (e) => {
    if (e.metaKey) {
      if (e.keyCode >= 0x30 && e.keyCode <= 0x39) {
        MIDI.send([0xc0, e.keyCode === 0x30 ? 9 : e.keyCode - 0x31])
        e.preventDefault()
        return
      }
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return
    e.stopPropagation()
    if (e.keyCode === 27) {
      if (this.toolbarElement) this.toolbarElement.focus()
      return
    }
    this.store.handleKeyDown(e.nativeEvent)
    e.preventDefault()
  }
  handleKeyUp = (e) => {
    e.stopPropagation()
    this.store.handleKeyUp(e.nativeEvent)
    e.preventDefault()
  }
  wheelListeners = new Set()
  registerWheelListener = (listener) => {
    this.wheelListeners.add(listener)
    return () => this.wheelListeners.remove(listener)
  }
  handleWheel = (e) => {
    if (e.target?.closest('[data-scroll-view]')) {
      return
    }
    if (document.activeElement === this.contentElement) {
      e.preventDefault()
      for (const wheelListener of this.wheelListeners) {
        wheelListener(e)
      }
    }
  }
  handleClick = (e) => {
    setTimeout(() => {
      if (!this.contentElement) return
      if (
        !document.activeElement ||
        !this.contentElement.contains(document.activeElement)
      ) {
        this.contentElement.focus()
      }
    })
  }

  renderContent() {
    return (
      <Switch>
        {this.instruments
          .map((instrument) => {
            const Component = instrument.component
            return (
              <Route
                key={instrument.id}
                path={`/${instrument.id}`}
                component={() => <Component store={this.store} />}
              />
            )
          })
          .concat([
            <Route
              key="@@configuration"
              path="/config"
              render={() => this.renderConfiguration()}
            />,
            <Route key="@@main" render={() => this.renderMainMenu()} />,
          ])}
      </Switch>
    )
  }
  renderMainMenu() {
    return (
      <ScrollView>
        <Observer>
          {() => (
            <React.Fragment>
              {MIDI.isNewWindowRequired() && <NewWindowRequired />}
            </React.Fragment>
          )}
        </Observer>
        <MainMenu>
          {this.instruments.map((instrument) => (
            <React.Fragment key={instrument.id}>
              {this.renderMenuItem(
                `#/${instrument.id}`,
                instrument.name,
                instrument.description
              )}
            </React.Fragment>
          ))}
        </MainMenu>
        <FeatureList features={this.props.features} />
      </ScrollView>
    )
  }
  renderConfiguration() {
    return (
      <ScrollView>
        <AppConfigurationEditor />
      </ScrollView>
    )
  }
  renderMenuItem(href, text, description) {
    return (
      <MainMenuItem>
        <MainMenuLink href={href}>
          <h2>{text}</h2>
          <p>{description}</p>
        </MainMenuLink>
      </MainMenuItem>
    )
  }

  render() {
    return (
      <div>
        <MainToolbarWrapper>
          <MainToolbar
            store={this.store}
            innerRef={(element) => (this.toolbarElement = element)}
          />
        </MainToolbarWrapper>
        <MainContent
          tabIndex={0}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          innerRef={(element) => (this.contentElement = element)}
        >
          {this.renderContent()}
        </MainContent>
        <BottomArea>
          <WheelController
            store={this.store}
            registerWheelListener={this.registerWheelListener}
          />
        </BottomArea>
        <Observer>
          {() => (
            <MIDIEmitter
              activeNotes={this.store.activeNotes}
              transpose={this.store.transpose}
              octave={this.store.octave}
              velocity={this.store.noteVelocity}
            />
          )}
        </Observer>
      </div>
    )
  }
}

const MainToolbarWrapper = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  height: 40px;
  left: 0;
`

const MainContent = styled('div')`
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 30px;
  left: 0;
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #656463;
  }
`

const BottomArea = styled('div')`
  position: absolute;
  height: 30px;
  right: 0;
  bottom: 0;
  left: 0;
`

const MainMenu = styled('ul')`
  font-size: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  list-style: none;
`

const MainMenuItem = styled('li')`
  flex-basis: 48%;
  display: flex;
  flex-direction: column;
`

const MainMenuLink = styled('a')`
  flex: 1;
  color: #e9e8e7;
  display: block;
  background: #252423;
  margin: 0.5em;
  padding: 0.5em;
  border: 2px solid #555453;
  text-align: left;
  text-decoration: none;
  box-shadow: 4px 4px 0 #090807;
  &:hover {
    transform: scale(1.025);
  }
  & > h2 {
    margin: 0;
    font-size: 1.5em;
    color: #bef;
  }
  & > p {
    margin: 0.5em 0 0;
  }
`

const ScrollViewElement = styled('div')`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

function ScrollView({ children }) {
  return <ScrollViewElement data-scroll-view="1">{children}</ScrollViewElement>
}

class MIDIEmitter extends React.Component {
  constructor(props) {
    super(props)
    this.currentNotes = new Map()
  }
  handleNotes(props) {
    const activeNotes = props.activeNotes
    const currentNotes = this.currentNotes
    for (const note of activeNotes) {
      if (!currentNotes.has(note)) {
        const midiNote = note + props.transpose + props.octave * 12
        const velocity = props.velocity
        MIDI.send([0x90, midiNote, velocity])
        currentNotes.set(note, { midiNote, velocity })
      }
    }
    for (const note of currentNotes.keys()) {
      if (!activeNotes.has(note)) {
        const data = currentNotes.get(note)
        MIDI.send([0x80, data.midiNote, data.velocity])
        currentNotes.delete(note)
      }
    }
  }
  componentDidMount() {
    this.handleNotes(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.handleNotes(nextProps)
  }
  render() {
    return null
  }
}

function NewWindowRequired() {
  return (
    <div style={{ margin: '1em auto', width: '96%' }}>
      <ErrorMessage>
        <strong>MIDI is not available in CodeSandbox Preview.</strong>
        <br />
        Please click “Open in New Window” button to use this app.
      </ErrorMessage>
    </div>
  )
}

const ErrorMessage = styled('a')`
  display: block;
  margin: 0.5em;
  padding: 0.5em;
  background: #422;
  border: 2px solid #c66;
  color: #e9e8e7;
  text-decoration: none;
  box-shadow: 4px 4px 0 #090807;
`

export default MainView
