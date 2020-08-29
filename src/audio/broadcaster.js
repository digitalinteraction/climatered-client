import { AUDIO_SAMPLE_RATE } from '@/const'

export const BroadcastState = {
  active: 'active',
  inactive: 'inactive'
}

//
// A class for listening to the microphone and sending data to a callback
//
export class AudioBroadcaster {
  _state = BroadcastState.inactive
  stream = null
  recorder = null

  static isSupported() {
    return Boolean(AudioContext)
  }

  get state() {
    return this._state
  }
  set state(newState) {
    this._state = newState
    this.onState(newState)
  }

  constructor(onState, onData) {
    this.onState = onState
    this.onData = onData
  }

  async start() {
    if (this.state !== BroadcastState.inactive) {
      throw new Error('Already recording!')
    }

    this.ctx = new AudioContext({
      sampleRate: AUDIO_SAMPLE_RATE
    })

    //
    // Get a stream of the user's microphone
    //
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        advanced: [{ sampleRate: AUDIO_SAMPLE_RATE }]
      }
    })
    this.stream = stream

    // Register our audio worklet
    await this.ctx.audioWorklet.addModule('/socket-record-processor.js')

    //
    // Create a AudioWorklet to handle raw microphone data for processing
    //
    const recorder = new AudioWorkletNode(this.ctx, 'socket-record-processor', {
      numberOfOutputs: 0
    })
    recorder.port.onmessage = event => {
      if (event.data.type === 'ondata') {
        this.onData(event.data.buffer)
      }
    }
    this.recorder = recorder

    //
    // Create a source to wrap our stream into the WebAudio API
    //
    const source = this.ctx.createMediaStreamSource(this.stream)
    source.onended = () => this.stop()
    source.connect(recorder)
    this.source = source

    this.state = BroadcastState.active
  }

  async stop() {
    if (this.state !== BroadcastState.active) {
      throw new Error('Not recording!')
    }

    this.state = BroadcastState.inactive
    this.stream?.getTracks().forEach(t => t.stop())

    this.source.disconnect()

    this.recorder.port.onmessage = null
    this.recorder.disconnect()

    await this.ctx.close()
  }

  handleStreamError(error) {
    switch (error.name) {
      case 'NotFoundError':
        alert('No microphones found')
        break
      case 'SecurityError':
      case 'PermissionDeniedError':
        // Do nothing; this is the same as the user canceling the call.
        break
      default:
        alert('Error opening your microphone: ' + error.message)
        break
    }
  }
}
