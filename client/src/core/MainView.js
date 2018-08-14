import * as MIDI from './MIDI'

import MainToolbar from './MainToolbar'
import React from 'react'
import createStore from './createStore'
import styled from 'react-emotion'
import { Switch, Route } from 'react-router-dom'
import { Observer } from 'mobx-react'
import { sortBy } from 'lodash'
import FeatureList from './FeatureList'

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    const { features } = props
    this.store = createStore(features)
    const instruments = sortBy(
      [].concat(...features.map(f => f.instruments || [])),
      'sortKey'
    )
    console.log('Loaded instruments:', instruments)
    this.instruments = instruments
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleGlobalKeyDown, false)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleGlobalKeyDown, false)
  }
  handleGlobalKeyDown = e => {
    if (e.keyCode === 13) {
      if (this.contentElement) this.contentElement.focus()
    }
  }
  handleKeyDown = e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    e.stopPropagation()
    if (e.keyCode === 13) {
      if (this.toolbarElement) this.toolbarElement.focus()
      return
    }
    this.store.handleKeyDown(e.nativeEvent)
    e.preventDefault()
  }
  handleKeyUp = e => {
    e.stopPropagation()
    this.store.handleKeyUp(e.nativeEvent)
    e.preventDefault()
  }
  renderContent() {
    return (
      <Switch>
        {this.instruments
          .map(instrument => {
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
            <Route key="@@main" render={() => this.renderMainMenu()} />,
          ])}
      </Switch>
    )
  }
  renderMainMenu() {
    return (
      <ScrollView>
        <MainMenu>
          {this.instruments.map(instrument => (
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
            innerRef={element => (this.toolbarElement = element)}
          />
        </MainToolbarWrapper>
        <MainContent
          tabIndex={0}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          innerRef={element => (this.contentElement = element)}
        >
          {this.renderContent()}
        </MainContent>
        <Observer>
          {() => (
            <MIDIEmitter
              activeNotes={this.store.activeNotes}
              transpose={this.store.transpose}
              octave={this.store.octave}
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
  bottom: 0;
  left: 0;
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #656463;
  }
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

const ScrollView = styled('div')`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

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
        MIDI.send([0x90, midiNote, 0x60])
        currentNotes.set(note, { midiNote })
      }
    }
    for (const note of currentNotes.keys()) {
      if (!activeNotes.has(note)) {
        const data = currentNotes.get(note)
        MIDI.send([0x80, data.midiNote, 0x60])
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

export default MainView
