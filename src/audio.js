export const BroadcastState = {
  active: 'active',
  inactive: 'inactive'
}

export const AUDIO_SAMPLE_RATE = 44100
export const AUDIO_LOW_LEVEL = 3
export const AUDIO_HIGH_LEVEL = 32

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
    // Get a stream of the user's microphone
    //
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        advanced: [{ sampleRate: AUDIO_SAMPLE_RATE }]
      }
    })
    this.stream = stream

    //
    // Create a source to wrap our stream into the WebAudio API
    //
    const source = this.ctx.createMediaStreamSource(this.stream)
    source.onended = () => this.stop()
    source.connect(recorder)
    this.source = source

    // const recorder = new MediaRecorder(stream, {
    //   mimeType: 'audio/webm',
    //   audioBitsPerSecond: AUDIO_SAMPLE_RATE
    // })
    //
    // recorder.ondataavailable = async event => {
    //   this.onData(event.data)
    // }
    //
    // recorder.start(1000)
    // this.recorder = recorder

    this.state = BroadcastState.active
  }

  async stop() {
    if (this.state !== BroadcastState.active) {
      throw new Error('Not recording!')
    }

    this.state = BroadcastState.inactive
    this.stream?.getTracks().forEach(t => t.stop())
    // this.recorder?.stop()

    this.source.disconnect()

    this.recorder.port.onmessage = null
    this.recorder.disconnect()

    this.state = BroadcastState.inactive

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

    const canvasWidth = 400
    const canvasHeight = 100

    const segmentSize = 256 * 128

    ctx.fillStyle = '#1e2428'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    const totalSamples = segmentSize * this.buffers.length
    const samplesPerPixel = Math.floor(totalSamples / canvasWidth)

    const rawBuffers = this.buffers.map(b => b.getChannelData(0))

    const getSample = globalIndex => {
      const segmentIndex = Math.floor(globalIndex / segmentSize)
      if (segmentIndex > this.buffers.length - 1) {
        console.log(this.buffers)
        return 0
      }

      const segment = rawBuffers[segmentIndex]
      const localIndex = globalIndex % segmentSize
      return segment[localIndex]
    }

    let largest = -1
    for (let i = 0; i < totalSamples; i += totalSamples / 100) {
      const sample = Math.abs(getSample(Math.floor(i)))
      if (sample) largest = sample
    }

    for (let x = 0; x < canvasWidth - 1; x++) {
      const min = x * samplesPerPixel
      const max = (x + 1) * samplesPerPixel - 1

      let sum = 0
      for (let j = min; j < max; j++) {
        sum += getSample(j)
      }

      let avg = sum / (max - min)

      // let y = (avg * canvasHeight) / 2
      // let y = canvasHeight - height

      // const y = avg * (canvasHeight / 2) + canvasHeight / 2
      const y = ((avg / largest + 1) / 2) * canvasHeight

      // console.log(y)

      ctx.fillStyle = '#00c073'
      ctx.fillRect(x, y + 1, 1, 3)
    }
  }
}
