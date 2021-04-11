import { Observer } from 'mobx-react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'reakit/Button'
import { Menu, MenuButton, MenuItem, useMenuState } from 'reakit/Menu'
import { Popover, PopoverDisclosure, usePopoverState } from 'reakit/Popover'
import { tw } from 'twind'
import * as MIDI from './MIDI'

export function AppSettingsPopover() {
  const popover = usePopoverState({ gutter: 4, placement: 'bottom-end' })
  return (
    <>
      <PopoverDisclosure {...popover} className={tw`text-#8b8685 px-2`}>
        <MIDIIcon />
      </PopoverDisclosure>
      <Popover {...popover} aria-label="MIDI settings">
        <div className={tw`w-[256px] bg-#090807 border border-#8b8685 p-2`}>
          <AppSettingsPopoverContents onClose={() => popover.hide()} />
        </div>
      </Popover>
    </>
  )
}

function AppSettingsPopoverContents(props: { onClose: () => void }) {
  let history = useHistory()
  const goToSettings = () => {
    history.push('/config')
    props.onClose()
  }
  return (
    <>
      <div className={tw`text-#8b8685`}>MIDI output port</div>
      <MIDIOutputSelector />

      <footer className={tw`text-right mt-2 text-sm text-#8b8685`}>
        <Button onClick={goToSettings}>
          More configuration settings &rarr;
        </Button>
      </footer>
    </>
  )
}

function MIDIIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 402 403"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M201 402.183c110.838 0 200.69-89.851 200.69-200.689S311.838.804 201 .804.31 90.656.31 201.494 90.162 402.183 201 402.183zm0-26.184c96.377 0 174.505-78.129 174.505-174.505 0-83.859-59.15-153.902-138.005-170.683V62c0 12.15-9.85 22-22 22h-29c-12.15 0-22-9.85-22-22V30.811C85.645 47.592 26.494 117.635 26.494 201.494c0 96.376 78.129 174.505 174.506 174.505zM72.975 226.912c14.038 0 25.418-11.38 25.418-25.418 0-14.039-11.38-25.419-25.418-25.419-14.039 0-25.42 11.38-25.42 25.419 0 14.038 11.381 25.418 25.42 25.418zm256.05 0c14.039 0 25.419-11.38 25.419-25.418 0-14.039-11.38-25.419-25.419-25.419-14.038 0-25.418 11.38-25.418 25.419 0 14.038 11.38 25.418 25.418 25.418zm-190.632 55.475c0 14.038-11.38 25.419-25.418 25.419-14.039 0-25.42-11.381-25.42-25.419s11.381-25.419 25.42-25.419c14.038 0 25.418 11.381 25.418 25.419zm176.051 0c0 14.038-11.38 25.419-25.419 25.419-14.038 0-25.418-11.381-25.418-25.419s11.38-25.419 25.418-25.419c14.039 0 25.419 11.381 25.419 25.419zM201 342.453c14.038 0 25.419-11.381 25.419-25.419S215.038 291.615 201 291.615s-25.419 11.381-25.419 25.419 11.381 25.419 25.419 25.419z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MIDIOutputSelector() {
  const menu = useMenuState({ gutter: 2 })
  const handleOutputSelect = (key: string) => {
    MIDI.selectOutput(key)
    menu.hide()
  }
  return (
    <>
      <MenuButton
        {...menu}
        className={tw`bg-#252423 p-1 border border-#454443`}
      >
        <Observer>{() => <>{MIDI.getStatus()}</>}</Observer>
      </MenuButton>
      <Menu
        {...menu}
        aria-label="MIDI output settings"
        className={tw`bg-#090807 border border-#8b8685 p-1`}
      >
        <Observer>
          {() => {
            const outputs = MIDI.getOutputs()
            return (
              <>
                {outputs.map((output) => {
                  return (
                    <MenuItem
                      key={output.key}
                      {...menu}
                      className={tw`block w-full focus:bg-#454443 text-left p-1`}
                      onClick={() => handleOutputSelect(output.key)}
                    >
                      {output.name}
                    </MenuItem>
                  )
                })}
              </>
            )
          }}
        </Observer>
      </Menu>
    </>
  )
}
