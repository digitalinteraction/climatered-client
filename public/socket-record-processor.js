// white-noise-processor.js
// class WhiteNoiseProcessor extends AudioWorkletProcessor {
//   process(inputs, outputs, parameters) {
//     const output = outputs[0]
//     output.forEach(channel => {
//       for (let i = 0; i < channel.length; i++) {
//         channel[i] = Math.random() * 2 - 1
//       }
//     })
//     return true
//   }
// }

const LIMIT = 256

// Recieves 128 samples directly from the input source (the mic)
// I'm trying to chunk them to reduce small message passing and socket payloads
// I don't think the copy of the arrays works

class SocketRecordProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.bucket = []
  }

  process(inputs /* outputs, parameters */) {
    if (this.bucket.length < LIMIT) {
      if (inputs[0][0]) {
        this.bucket.push(new Float32Array(inputs[0][0]))
      }
    } else {
      // console.log(inputs, outputs)
      const length = this.bucket.reduce((sum, arr) => sum + arr.length, 0)

      const array = new Float32Array(length)

      let i = 0
      for (const samples of this.bucket) {
        for (let s of samples) {
          array[i++] = s
        }
      }

      this.port.postMessage({ type: 'ondata', buffer: array.buffer }, [
        array.buffer
      ])
      this.bucket = []
    }

    // ...
    return true
  }
}

registerProcessor('socket-record-processor', SocketRecordProcessor)
