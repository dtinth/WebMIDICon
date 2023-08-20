import React, { useEffect } from 'react';
import { useConfiguration } from './AppConfigurationHooks';
import { showInformationMessage } from './showInformationMessage';
import { StatusBarItem } from './StatusBar';

// HACK: Allow switching output channel from keyboard.
export let switchOutputChannel = () => { };

export function OutputChannelSwitcher() {
  const mainChannel = useConfiguration('midi.output.channel');
  useEffect(() => {
    switchOutputChannel = (channel) => {
      mainChannel.setValue(String(channel));
      showInformationMessage('Switched output channel to ch.' + (channel + 1));
    };
  }, [mainChannel.setValue]);
  return <StatusBarItem>ch.{+mainChannel.value + 1}</StatusBarItem>;
}
