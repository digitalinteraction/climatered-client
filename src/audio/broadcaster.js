import { AUDIO_TRANSPORT_RATE } from '@/const'
import { resample, resampledLength, float32ToInt16 } from './resample'

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

  getTrackRate() {
    const tracks = this.stream.getAudioTracks()
    const trackSettings = tracks[0].getSettings()
    return trackSettings.sampleRate
  }

  async start(deviceId) {
    if (this.state !== BroadcastState.inactive) {
      throw new Error('Already recording!')
    }

    this.ctx = new AudioContext({
      sampleRate: AUDIO_TRANSPORT_RATE
    })

    //
    // Get a stream of the user's microphone
    //
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        deviceId,
        sampleRate: { ideal: AUDIO_TRANSPORT_RATE },
        echoCancellation: true,
        noiseSuppression: true
      }
    })
    this.stream = stream

    const chosenDevice = stream.getAudioTracks()[0].deviceId

    // Register our audio worklet
    await this.ctx.audioWorklet.addModule('/socket-record-processor.js')

    //
    // Create a AudioWorklet to handle raw microphone data for processing
    //
    const recorder = new AudioWorkletNode(this.ctx, 'socket-record-processor', {
      channelCount: 1,
      numberOfInputs: 1,
      numberOfOutputs: 0
    })
    recorder.port.onmessage = event => {
      if (event.data.type === 'ondata') {
        this.handleData(
          event.data.buffer,
          this.ctx.sampleRate,
          AUDIO_TRANSPORT_RATE
        )
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

    return { chosenDevice }
  }

  handleData(arrayBuffer, inputRate, outputRate) {
    const inputFloats = new Float32Array(arrayBuffer)

    const targetLength = resampledLength(
      inputFloats.length,
      inputRate,
      outputRate
    )

    console.debug(
      'AudioBroadcaster#handleData byteLength=%d inputRate=%d outputRate=%d outputLength=%d',
      arrayBuffer.byteLength,
      inputRate,
      outputRate,
      targetLength
    )

    const outputFloats = new Float32Array(targetLength)
    resample(inputFloats, outputFloats)

    const ints = float32ToInt16(outputFloats)
    console.debug(
      'AudioBroadcaster#handleData floatLength=%d intLength',
      outputFloats.buffer.byteLength,
      ints.buffer.byteLength
    )

    this.onData(ints.buffer, outputRate)
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
