# midi-instruments

A collection of **web-based MIDI instruments.** I wanted to create a MIDI instrument that allows me to jam with other musicians. Play MIDI with your PC keyboard, or with a touch screen.


## Check out the video demos!

- **Original demo video at JSConf.Asia 2016**<br />
  https://www.youtube.com/watch?v=3Y-XeJmGQis

- **iPad-drumming demo**<br />
  *Wada Kouji - Butter-Fly (Digimon Tri Ver.) (Cover by MindaRyn)*<br />
  https://www.youtube.com/watch?v=CHarkZrQH34


## Usage

1. Go to [https://dtinth.github.io/midi-instruments/](https://dtinth.github.io/midi-instruments/) using a browser that supports Web MIDI API.

2. Select the output MIDI port at the top-right corner. See [MIDI setup](#midi-setup) section for more details.

3. Play and enjoy!


## Hacking on this project

- The easiest way is to use Code Sandbox! https://codesandbox.io/s/github/dtinth/midi-instruments/tree/master/client


## MIDI setup

MIDI communicates via MIDI ports. This section describe on setting them up.


### Physical MIDI ports

If you connect a physical MIDI port to your computer, no further setup is necessary.


### Sending MIDI messages to another app on the same computer

You need to create a __virtual MIDI cable__ (a.k.a. <acronym title="inter-application communication">IAC</acronym> driver or loopback MIDI interface).

- On __macOS:__ Open __Audio MIDI Setup__ and go to __MIDI Studio.__ Inside the __IAC Driver,__ create a new __Bus.__

- On __Windows:__ You can use something like LoopBe1 I guess.


### iOS &rarr; Mac

You can use the __Web MIDI Browser__ app, a iOS web browser that supports Web MIDI API.
Then you can set up a Bluetooth LE connection from your iDevice to Mac.


## Offline iOS App

For offline playing, you can find an Xcode project in the [ios](ios) folder and compile it yourself.
