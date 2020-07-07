export const BroadcastState = {
  active: 'active',
  inactive: 'inactive'
}

export const AUDIO_SAMPLE_RATE = 44100
export const AUDIO_LOW_LEVEL = 16
export const AUDIO_HIGH_LEVEL = 64
export const AUDIO_CHUNK_SIZE = 16 * 1024

//
// A class for listening to the microphone and sending data to a callback
//
export class AudioBroadcaster {
  _state = BroadcastState.inactive
  stream = null
  recorder = null

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
      // sampleRate: AUDIO_SAMPLE_RATE
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

    // await this.startUsingRecorder()
    // await this.startUsingAudioWorklet()
    await this.startUsingScriptProcessor()

    this.state = BroadcastState.active
  }

  async startUsingRecorder() {
    const recorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: AUDIO_SAMPLE_RATE
    })

    recorder.ondataavailable = async event => {
      this.onData(event.data)
    }

    recorder.start(1000)
    this.recorder = recorder
  }

  async startUsingAudioWorklet() {
    await this.ctx.audioWorklet.addModule('/socket-record-processor.js')

    //
    // Create a AudioWorklet to handle raw microphone data for processing
    //
    const recorder = new AudioWorkletNode(this.ctx, 'socket-record-processor', {
      numberOfOutputs: 0
    })
    recorder.port.onmessage = event => {
      console.log(event)

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
  }

  async startUsingScriptProcessor() {
    const processor = this.ctx.createScriptProcessor(AUDIO_CHUNK_SIZE, 1, 0)
    processor.onaudioprocess = e => {
      this.onData(e.inputBuffer.getChannelData(0).buffer)
    }
    this.processor = processor

    const source = this.ctx.createMediaStreamSource(this.stream)
    source.onended = () => this.stop()
    source.connect(processor)
    this.source = source
  }

  async stop() {
    if (this.state !== BroadcastState.active) {
      throw new Error('Not recording!')
    }

    this.state = BroadcastState.inactive
    this.stream?.getTracks().forEach(t => t.stop())

    // await this.stopUsingWebRecorder()
    // await this.stopUsingAudioWorklet()
    await this.stopUsingScriptProcessor()

    await this.ctx.close()
  }

  async stopUsingWebRecorder() {
    this.recorder?.stop()
  }

  async stopUsingAudioWorklet() {
    this.source.disconnect()

    this.recorder.port.onmessage = null
    this.recorder.disconnect()
  }

  async stopUsingScriptProcessor() {
    this.source.disconnect()
    this.source = null
    this.processor = null
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

//
// A class for receiving chunks of audio and queing them up for playback
//
export const RecieverState = {
  inactive: 'inactive',
  buffering: 'buffering',
  playing: 'playing'
}

export class AudioReciever {
  _state = RecieverState.inactive

  get state() {
    return this._state
  }
  set state(newState) {
    this._state = newState
    this.onChange(newState)
  }

  constructor(onChange) {
    this.onChange = onChange
    this.ctx = new AudioContext({
      sampleRate: AUDIO_SAMPLE_RATE
    })
    this.buffers = []
  }

  push(data) {
    if (this.state === RecieverState.inactive) return

    const floats = new Float32Array(data)
    const buffer = this.ctx.createBuffer(
      1,
      data.byteLength / 4,
      AUDIO_SAMPLE_RATE
    )

    buffer.copyToChannel(floats, 0, 0)
    this.buffers.push(buffer)

    if (
      this.state === RecieverState.buffering &&
      this.buffers.length >= AUDIO_LOW_LEVEL
    ) {
      this.state = RecieverState.playing
      this.unqueueBuffer()
    }
  }

  play() {
    if (this.buffers.length < AUDIO_LOW_LEVEL) {
      this.state = RecieverState.buffering
    } else {
      this.state = RecieverState.playing
      this.unqueueBuffer()
    }
  }

  stop() {
    this.buffers = []
    this.state = RecieverState.inactive
    this.ctx = null

    // stop the current BufferSource ?
  }

  unqueueBuffer() {
    if (this.buffers.length === 0) {
      this.state = RecieverState.buffering
      return
    }

    if (this.state !== RecieverState.playing) {
      return
    }

    const [top, ...rest] = this.buffers.slice(-AUDIO_HIGH_LEVEL)

    const source = this.ctx.createBufferSource()
    source.buffer = top
    source.connect(this.ctx.destination)
    source.start()

    source.onended = () => {
      this.unqueueBuffer()
    }

    this.buffers = rest
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  doodle(canvas) {
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const canvasWidth = 400
    const canvasHeight = 100

    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    const rawBuffers = this.buffers.map(b => b.getChannelData(0))
    const totalSamples = rawBuffers.reduce((sum, b) => sum + b.length, 0)
    const samplesPerPixel = Math.floor(totalSamples / canvasWidth)

    const getSample = globalIndex => {
      let i = 0

      for (let buffer of rawBuffers) {
        if (globalIndex - i >= buffer.length) {
          i += buffer.length
        } else {
          return buffer[globalIndex - i]
        }
      }

      throw new Error('Sample out of index')
    }

    function sampleToCanvas(y) {
      return ((y * amplify + 1) / 2) * canvasHeight
    }

    const lineWidth = 4
    const lineGap = 2
    const amplify = 2

    // Loop across each pixel of the canvas
    for (let x = 0; x < canvasWidth - 1; x += lineWidth + lineGap) {
      const min = x * samplesPerPixel
      const max = (x + 1) * samplesPerPixel - 1

      let largest = -1
      let smallest = 1
      for (let j = min; j < max; j++) {
        let sample = getSample(j)
        if (sample > largest) largest = sample
        if (sample < smallest) smallest = sample
      }

      let top = sampleToCanvas(largest)
      let bottom = sampleToCanvas(smallest)

      ctx.fillStyle = '#e63946'
      ctx.fillRect(x - lineWidth / 2, top, lineWidth, bottom - top)
    }
  }
}
