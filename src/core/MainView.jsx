import * as MIDI from './MIDI';

import { Observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'react-emotion';
import { Route, Switch } from 'react-router-dom';
import { tw } from 'twind';
import { AppConfigurationEditor } from './AppConfigurationEditor';
import { AppServices } from './AppServices';
import FeatureList from './FeatureList';
import MIDIEmitter from './MIDIEmitter';
import MainToolbar from './MainToolbar';
import { StatusBar } from './StatusBar';
import WheelController from './WheelController';
import { showInformationMessage } from './showInformationMessage';
import {
  OutputChannelSwitcher,
  switchOutputChannel,
} from './switchOutputChannel';

export const MainView = ({ features, store }) => {
  const contentElementRef = useRef(null);
  const toolbarElementRef = useRef(null);
  const wheelListenersRef = useRef(new Set());

  const [instruments, setInstruments] = useState([])

  const handleKeyDown = (e) => {
    if (e.metaKey) {
      if (e.keyCode >= 0x30 && e.keyCode <= 0x39) {
        MIDI.send([0xc0, e.keyCode === 0x30 ? 9 : e.keyCode - 0x31]);
        showInformationMessage(
          'Program change to #' + (e.keyCode === 0x30 ? 10 : e.keyCode - 0x30)
        );
        e.preventDefault();
        return;
      }
    }
    if (e.ctrlKey) {
      const updateVelocity = (delta) => {
        const velocity = Math.round(
          Math.max(0, Math.min(127, store.noteVelocity + delta * 8))
        );
        store.noteVelocity = velocity;
        showInformationMessage('Velocity: ' + velocity);
      };
      if (e.keyCode >= 0x30 && e.keyCode <= 0x39) {
        switchOutputChannel(e.keyCode === 0x30 ? 10 : e.keyCode - 0x30);
        e.preventDefault();
        return;
      } else if (e.keyCode === 189) {
        // Ctrl + -
        updateVelocity(-1);
        e.preventDefault();
        return;
      } else if (e.keyCode === 187) {
        // Ctrl + =
        updateVelocity(1);
        e.preventDefault();
        return;
      }
    }
    if (e.metaKey || e.ctrlKey) return;
    e.stopPropagation();
    if (e.keyCode === 27) {
      if (toolbarElementRef.current) toolbarElementRef.current.focus();
      return;
    }
    store.handleKeyDown(e.nativeEvent);
    e.preventDefault();
  };
  
  const handleKeyUp = (e) => {
    e.stopPropagation();
    store.handleKeyUp(e.nativeEvent);
    e.preventDefault();
  };
  
  const handleClick = (e) => {
    setTimeout(() => {
      if (!contentElementRef.current) return;
      if (
        !document.activeElement ||
        !contentElementRef.current.contains(document.activeElement)
      ) {
        contentElementRef.current.focus();
      }
    });
  };
  
  const registerWheelListener = (listener) => {
    const listeners = wheelListenersRef.current;
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const renderMainMenu = useCallback(
    () => {
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
            {instruments.map((instrument) => (
              <React.Fragment key={instrument.id}>
                {renderMenuItem(
                  `#/${instrument.id}`,
                  instrument.name,
                  instrument.description
                )}
              </React.Fragment>
            ))}
          </MainMenu>
          <FeatureList features={features} />
        </ScrollView>
      );
    },
    [instruments]
  )
  
  const renderConfiguration = () => {
    return (
      <ScrollView>
        <AppConfigurationEditor />
      </ScrollView>
    );
  };
  
  const renderMenuItem = (href, text, description) => {
    return (
      <MainMenuItem>
        <MainMenuLink href={href}>
          <h2>{text}</h2>
          <p>{description}</p>
        </MainMenuLink>
      </MainMenuItem>
    );
  };

  const sortByKey = (array, key) => {
    return array.sort((a, b) => {
      const keyA = a[key];
      const keyB = b[key];
      const numA = parseInt(keyA.split('_')[0]);
      const numB = parseInt(keyB.split('_')[0]);
      if (numA === numB) {
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      } else {
        return numA - numB;
      }
    });
  }

  useEffect(() => {
    const orderedInstruments = sortByKey(features.flatMap((f) => f.instruments || []), 'sortKey')
    console.log('Loaded instruments:', orderedInstruments);
    setInstruments(orderedInstruments)

    const handleGlobalKeyDown = (e) => {
      if (e.keyCode === 13) {
        if (contentElementRef.current) {
          contentElementRef.current.focus();
        }
      }
    };

    const handleWheel = (e) => {
      if (e.target?.closest('[data-scroll-view]')) {
        return;
      }
      if (document.activeElement === contentElementRef.current) {
        e.preventDefault();
        for (const wheelListener of wheelListenersRef.current) {
          wheelListener(e);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, false);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, false);
      window.removeEventListener('wheel', handleWheel, { passive: false });
    };
  }, []);
  
  return (
    <div>
      <MainToolbarWrapper>
        <MainToolbar
          store={store}
          innerRef={(element) => (toolbarElementRef.current = element)}
        />
      </MainToolbarWrapper>
      <MainContent
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        innerRef={(element) => (contentElementRef.current = element)}
      >
        <Switch>
          {instruments.map((instrument) => {
            const Component = instrument.component;
            return (
              <Route
                key={instrument.id}
                path={`/${instrument.id}`}
                component={() => <Component store={store} />}
              />
            );
          }).concat([
            <Route
              key="@@configuration"
              path="/config"
              render={() => renderConfiguration()}
            />,
            <Route key="@@main" render={() => renderMainMenu()} />,
          ])}
        </Switch>
      </MainContent>
      <BottomArea>
        <WheelController
          store={store}
          registerWheelListener={registerWheelListener}
        />
      </BottomArea>
      <section
        className={tw`absolute bottom-0 inset-x-0 h-[24px] flex bg-#252423 border-t border-#454443`}
      >
        <StatusBar />
      </section>
      <Observer>
        {() => (
          <MIDIEmitter
            activeNotes={store.activeNotes}
            transpose={store.transpose}
            octave={store.octave}
            velocity={store.noteVelocity}
          />
        )}
      </Observer>
      <AppServices features={features} store={store} />
      <OutputChannelSwitcher />
    </div>
  );
};

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
  bottom: 54px;
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
  bottom: 24px;
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
