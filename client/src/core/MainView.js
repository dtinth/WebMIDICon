import * as MIDI from './MIDI'

import MainToolbar from './MainToolbar'
import React from 'react'
import createStore from './createStore'
import styled from 'react-emotion'
import { Switch, Route } from 'react-router-dom'
import { Observer } from 'mobx-react'

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.store = createStore()
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
  handleKeyDown = e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    this.store.handleKeyDown(e.keyCode)
    e.preventDefault()
  }
  handleKeyUp = e => {
    this.store.handleKeyUp(e.keyCode)
    e.preventDefault()
  }
  renderContent() {
    return (
      <Switch>
        {this.props.instruments
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
      <MainMenu>
        {this.props.instruments.map(instrument => (
          <React.Fragment key={instrument.id}>
            {this.renderMenuItem(
              `#/${instrument.id}`,
              instrument.name,
              instrument.description
            )}
          </React.Fragment>
        ))}
      </MainMenu>
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
          <MainToolbar store={this.store} />
        </MainToolbarWrapper>
        <MainContent>{this.renderContent()}</MainContent>
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
    color: #d7fc70;
  }
  & > p {
    margin: 0.5em 0 0;
  }
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
