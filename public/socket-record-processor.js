const BUFFER_SIZE = 128 * 128

// Recieves 128 samples directly from the input source (the mic)
// I'm trying to chunk them to reduce small message passing and socket payloads

class SocketRecordProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.bucket = []
    this.resetBuffer()
  }

  resetBuffer() {
    this.buffer = new Float32Array(BUFFER_SIZE)
    this.insertIndex = 0
  }

  /** @param {ArrayBuffer} arrayBuffer */
  postBuffer(arrayBuffer) {
    this.port.postMessage({ kind: 'ondata', arrayBuffer }, [arrayBuffer])
  }

  /** @param {Float32Array[][]} inputs */
  process(inputs) {
    if (!inputs[0][0]) return true

    // Loop through each new sample
    for (let i = 0; i < inputs[0][0].length; i++) {
      this.insertIndex++

      // If we've reached the end of our internal buffer, post it and restart
      if (this.insertIndex > this.buffer.length) {
        this.postBuffer(this.buffer.buffer)
        this.resetBuffer()
      }

      // Put the sample into our local buffer
      this.buffer[this.insertIndex] = inputs[0][0][i]
    }

    return true
  }
}

registerProcessor('socket-record-processor', SocketRecordProcessor)
