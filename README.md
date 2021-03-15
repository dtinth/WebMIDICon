# WebMIDICon

A collection of **hackable web-based MIDI instruments, implemented as a MIDI controller.**
I wanted to create a MIDI instrument that allows me to jam with other musicians.
Play MIDI with your PC keyboard, or with a touch screen on an iPad.

## Check out the video demos!

- **Original demo video at JSConf.Asia 2016**<br />
  _It shows the available features of this project and the ways it can be used._<br />
  https://www.youtube.com/watch?v=3Y-XeJmGQis

- **iPad-drumming demo**<br />
  _Wada Kouji - Butter-Fly (Digimon Tri Ver.) (Cover by MindaRyn)_<br />
  https://www.youtube.com/watch?v=CHarkZrQH34

- **Joypedal**<br />
  _Use a Dualshock gamepad as a sustain pedal_<br />
  https://www.facebook.com/dtinth/videos/10210321390065310/

- **Piano on PC keyboard**<br />
  _Playing piano on a PC keyboard_<br />
  https://www.facebook.com/nattanicha/videos/10156579275643936/

## Usage

1. Go to [https://webmidicon.web.app/](https://webmidicon.web.app/) using a browser that supports Web MIDI API.

2. Select the output MIDI port at the top-right corner. See [MIDI setup](#midi-setup) section for more details.

3. Play and enjoy!

## Hacking on this project

- Code on GitPod: https://gitpod.io/#https://github.com/dtinth/WebMIDICon

- Remix this project on Glitch: https://glitch.com/edit/#!/webmidicon

- Fork on Code Sandbox: https://codesandbox.io/s/github/dtinth/midi-instruments/tree/master

## MIDI setup

This webapp uses Web MIDI API to communicate with the MIDI subsystem on your device.

### What is MIDI subsystem?

The MIDI subsystem allows applications running on your computer to communicate with MIDI devices.
The MIDI subsystem provides:

- **Input ports** allow applications to receive MIDI messages from other MIDI devices (e.g. a MIDI keyboard).
- **Output ports** allows applications to send MIDI messages to other MIDI devices (e.g. a synthesizer).

This webapp is used as an instrument for transmitting MIDI messages, therefore it only works with **MIDI outputs**.

### Webapp &rarr; Hardware synthesizer

- You can connect a MIDI synthesizer to your computer, and no further setup is necessary.

### Webapp &rarr; Another MIDI app on the same computer

You need to create a **virtual MIDI cable** (a.k.a. <acronym title="inter-application communication">IAC</acronym> driver or loopback MIDI interface).

- On **macOS:** Open **Audio MIDI Setup** and go to **MIDI Studio.** Inside the **IAC Driver,** create a new **Bus.**

- On **Windows:** You can use something like LoopBe1 I guess.

### iOS &rarr; Mac

You can use the **Web MIDI Browser** app, a iOS web browser that supports Web MIDI API.
Then you can set up a Bluetooth LE connection from your iDevice to Mac.
