import {
  float32ToInt16,
  linearResample,
  getResampledLength,
} from '@openlab/deconf-ui-toolkit'

//
// TODO: move correct logic back to deconf
//

type WebkitWindow = typeof window & { webkitAudioContext?: AudioContext }
function getAudioContext(): typeof AudioContext | null {
  return (
    window.AudioContext || (window as WebkitWindow).webkitAudioContext || null
  )
}

export enum BroadcasterState {
  active = 'active',
  inactive = 'inactive',
}

interface OnChange {
  (change: { state: BroadcasterState }): void
}

interface OnData {
  (arrayBuffer: ArrayBuffer, sampleRate: number): void
}

interface OnDebug {
  (...args: unknown[]): void
}

export interface AudioBroadcasterOptions {
  audioTransportRate: number
  onChange: OnChange
  onData: OnData
  onDebug: OnDebug
  audioWorklet: {
    name: string
    path: string
  }
}

export class AudioBroadcaster {
  static isSupported(): boolean {
    return Boolean(getAudioContext())
  }

  private _state = BroadcasterState.inactive
  private stream: null | MediaStream = null
  private recorder: null | AudioWorkletNode = null
  private ctx: null | AudioContext = null
  private source: null | MediaStreamAudioSourceNode = null

  get state(): BroadcasterState {
    return this._state
  }
  set state(newState: BroadcasterState) {
    this._state = newState
    this.emitChange()
  }

  private emitChange() {
    this.options.onChange({
      state: this.state,
    })
  }

  constructor(public options: AudioBroadcasterOptions) {}

  async start(
    previousDeviceId: string | undefined
  ): Promise<{ chosenDevice?: string }> {
    if (this.state === BroadcasterState.active) {
      throw new Error('Already started')
    }

    const AudioContext = getAudioContext() as typeof window.AudioContext
    this.ctx = new AudioContext({
      sampleRate: this.options.audioTransportRate,
    })

    // TODO: work out why `noiseSuppression` isn't working
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        deviceId: { ideal: previousDeviceId },
        sampleRate: { ideal: this.options.audioTransportRate },
        echoCancellation: { ideal: true },
        // noiseSuppression: { ideal: true },
      },
    })
    // TODO: what if the user manually closes the stream?

    // TODO: what happens if sampleRate is not set
    const { deviceId } = this.stream.getAudioTracks()[0].getSettings()
    const { sampleRate } = this.ctx

    // Register the user's audio worklet
    // TODO: provide an example one of these
    await this.ctx.audioWorklet.addModule(this.options.audioWorklet.path)

    // Create a recorder to process the oudio
    this.recorder = new AudioWorkletNode(
      this.ctx,
      this.options.audioWorklet.name,
      {
        channelCount: 1,
        numberOfInputs: 1,
        numberOfOutputs: 0,
      }
    )
    this.recorder.port.onmessage = (event) => {
      const { kind, arrayBuffer } = event.data

      if (kind === 'ondata' && arrayBuffer) {
        this.handleData(
          arrayBuffer,
          sampleRate,
          this.options.audioTransportRate
        )
        return
      }

      console.error('Unknown AudioBroadcaster port message', event.data)
    }

    // Create a source to connect the stream to the recorder
    this.source = this.ctx.createMediaStreamSource(this.stream)
    this.source.connect(this.recorder)

    this.state = BroadcasterState.active

    return { chosenDevice: deviceId }
  }
  stop(): void {
    if (this.state !== BroadcasterState.active) {
      throw new Error('Not recording')
    }

    this.state = BroadcasterState.inactive

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop())
    }
    if (this.source) {
      this.source.disconnect()
    }
    if (this.recorder) {
      this.recorder.port.onmessage = null
      this.recorder.disconnect()
    }
    if (this.ctx) {
      this.ctx.close()
    }
  }

  handleData(
    arrayBuffer: ArrayBuffer,
    inputRate: number,
    outputRate: number
  ): void {
    const inputFloats = new Float32Array(arrayBuffer)
    const targetLength = getResampledLength(
      inputFloats.length,
      inputRate,
      outputRate
    )

    this.options.onDebug(
      'AudioBroadcaster#handleData byteLength=%d inputRate=%d outputRate=%d outputLength=%d',
      arrayBuffer.byteLength,
      inputRate,
      outputRate,
      targetLength
    )

    const outputFloats = new Float32Array(targetLength)
    linearResample(inputFloats, outputFloats)

    this.options.onData(float32ToInt16(outputFloats).buffer, outputRate)
  }
  handleStreamError(error: Error): void {
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
