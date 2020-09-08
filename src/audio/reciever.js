import Vue from 'vue'
import { resample, resampledLength, int16ToFloat32 } from './resample'

import { AUDIO_PLAYBACK_RATE, AUDIO_LOW_LEVEL, AUDIO_HIGH_LEVEL } from '@/const'

export const RecieverState = {
  inactive: 'inactive',
  buffering: 'buffering',
  playing: 'playing'
}

//
// A class for receiving chunks of audio and queing them up for playback
//
export class AudioReciever extends Vue {
  _state = RecieverState.inactive
  stats = {}

  get playbackRate() {
    return this.ctx.sampleRate
  }

  static isSupported() {
    return Boolean(AudioContext)
  }

  get state() {
    return this._state
  }
  set state(newState) {
    this._state = newState
    this.setStats({ state: newState })
  }

  setup() {
    console.debug('AudioReciever#setup')

    this.ctx = new AudioContext({
      sampleRate: AUDIO_PLAYBACK_RATE
    })

    this.buffers = []
    this.nextPacket = 1

    this.stats = {
      state: null,
      bufferSize: 0,
      input: null,
      output: null
    }

    this.state = RecieverState.inactive
  }

  play() {
    this.state = RecieverState.buffering

    if (this.buffers.length > AUDIO_LOW_LEVEL) {
      this.state = RecieverState.playing
      this.unqueueBuffer()
    }
  }

  stop() {
    this.state = RecieverState.inactive
  }

  teardown() {
    console.debug('AudioReciever#teardown')

    this.buffers = []
    this.state = RecieverState.inactive
    this.ctx.close()
    this.ctx = null
  }

  async push(data) {
    const { arrayBuffer, sampleRate } = data

    if (!this.ctx) return

    const inputInts = new Int16Array(arrayBuffer)
    const inputFloats = int16ToFloat32(inputInts)

    const targetLength = resampledLength(
      inputFloats.length,
      sampleRate,
      this.playbackRate
    )

    console.debug(
      'AudioReciever#push intsLength=%d floatsLength=%d inputRate=%d outputRate=%d',
      arrayBuffer.byteLength,
      inputFloats.buffer.byteLength,
      sampleRate,
      this.playbackRate
    )

    const audioBuffer = this.ctx.createBuffer(
      1,
      targetLength,
      this.playbackRate
    )
    const outputFloats = audioBuffer.getChannelData(0)

    resample(inputFloats, outputFloats)

    this.buffers.push({
      index: this.nextPacket++,
      buffer: audioBuffer
    })

    this.setStats({
      input: {
        byteLength: data.arrayBuffer.byteLength,
        sampleRate: sampleRate
      },
      output: {
        byteLength: outputFloats.buffer.byteLength,
        samples: outputFloats.length,
        sampleRate: this.playbackRate
      },
      bufferSize: this.buffers.length
    })
  }

  setStats(partial) {
    this.stats = {
      ...this.stats,
      ...partial
    }
    this.$emit('stats', this.stats)
  }

  unqueueBuffer() {
    if (this.state === RecieverState.inactive) {
      return
    }

    if (this.buffers.length === 0) {
      this.state = RecieverState.buffering
      return
    }

    if (this.state !== RecieverState.playing) {
      return
    }

    if (this.state === RecieverState.playing && this.buffers.length < 1) {
      this.state = RecieverState.buffering
      return
    }

    const [top, ...rest] = this.buffers.slice(-AUDIO_HIGH_LEVEL)

    const source = this.ctx.createBufferSource()
    source.buffer = top.buffer
    source.connect(this.ctx.destination)

    source.onended = () => {
      console.debug('source@onended packet=%d', top.index)
      source.disconnect(this.ctx)
      this.unqueueBuffer()
    }

    source.start()

    this.buffers = rest

    this.setStats({
      bufferSize: this.buffers.length
    })
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
    const lineInterval = lineWidth + lineGap
    const amplify = 2

    // Loop across each pixel of the canvas
    for (let x = 0; x < canvasWidth - 1; x += lineInterval) {
      const min = x * samplesPerPixel
      const max = Math.min(
        (x + lineInterval) * samplesPerPixel - 1,
        totalSamples - 1
      )

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
