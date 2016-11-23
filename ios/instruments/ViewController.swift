//
//  ViewController.swift
//  instruments
//
//  Created by Thai Pangsakulyanont on 2016/11/19.
//  Copyright © 2016 Bemuse. All rights reserved.
//

import UIKit
import CoreAudioKit
import WebKit
import CoreMIDI

class ViewController: UIViewController, WKScriptMessageHandler {
	@IBAction func setupMidi(_ sender: UIButton) {
		let midiController = CABTMIDILocalPeripheralViewController()
		midiController.modalPresentationStyle = .popover
		if let popover = midiController.popoverPresentationController {
			popover.sourceView = sender
		}
		present(midiController, animated: true, completion: nil)
	}
	@IBOutlet weak var webViewContainer: UIView!
	var webview: WKWebView!
	var midiClient: MIDIClientRef = 0
	var midiPort: MIDIPortRef = 0
	var packet = MIDIPacket()
	var midiDest: MIDIEndpointRef = 0

	override func viewDidLoad() {
		super.viewDidLoad()
		let webViewConfig = WKWebViewConfiguration()
		webViewConfig.userContentController.add(self, name: "send")
		let webview = WKWebView(frame: webViewContainer.bounds, configuration: webViewConfig)
		webViewContainer.addSubview(webview)
		let bundle = Bundle.main
		let file = bundle.url(forResource: "index", withExtension: "html", subdirectory: "build")
		let folder = bundle.url(forResource: "build", withExtension: nil)
		webview.loadFileURL(file!, allowingReadAccessTo: folder!)
		webview.autoresizingMask = [.flexibleHeight, .flexibleWidth]
	}

	func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
		if message.name == "send" {
			let data = "\(message.body)"
			let components = data.components(separatedBy: ";")
			var bytes = [UInt8]()
			for component in components {
				if let result = UInt8(component) {
					bytes.append(result)
				}
			}
			sendMidi(bytes: bytes)
		}
	}

	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
		// Dispose of any resources that can be recreated.
	}
	
	func sendMidi (bytes: [UInt8]) {
		initializeMidi()
		packet.timeStamp = 0
		if bytes.count >= 1 { packet.data.0 = bytes[0]; packet.length = 1 }
		if bytes.count >= 2 { packet.data.1 = bytes[1]; packet.length = 2 }
		if bytes.count >= 3 { packet.data.2 = bytes[2]; packet.length = 3 }
		var packetList = MIDIPacketList(numPackets: 1, packet: packet)
		if midiDest == 0 {
			var destinationNumber = 0
			let destinationCount = MIDIGetNumberOfDestinations()
			for i in 0..<destinationCount {
				let destination = MIDIGetDestination(i)
				var result: Unmanaged<CFString>?
				MIDIObjectGetStringProperty(destination, kMIDIPropertyName, &result)
				if let foundName = result {
					let name = foundName.takeRetainedValue() as String
					NSLog("Destination \(i) name \(name)")
					if name == "Bluetooth" {
						destinationNumber = i
					}
				}
			}
			midiDest = MIDIGetDestination(destinationNumber)
			NSLog("Selecting destination \(midiDest) out of \(MIDIGetNumberOfDestinations()) destinations")
		}
		MIDISend(midiPort, midiDest, &packetList);
		NSLog("Sending MIDI \(bytes) => \(midiPort) \(midiDest)")
	}
	
	func initializeMidi () {
		if (midiClient == 0) {
			MIDIClientCreate("my midi instruments" as CFString, nil, nil, &midiClient)
			MIDIOutputPortCreate(midiClient, "my midi port" as CFString, &midiPort)
		}
	}
}

