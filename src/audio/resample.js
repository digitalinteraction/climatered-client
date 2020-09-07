export function resampledLength(inputLength, inputRate, outputRate) {
  return Math.round((outputRate * inputLength) / inputRate)
}

export const resample = linearResample

/**
 * Resample an array using a nearest neighbor interpolation
 * @param {number[]} from
 * @param {number[]} to
 */
export function nearestResample(from, to) {
  console.debug('#nearestResample', from.length, to.length)
  for (let i = 0; i < to.length; i++) {
    const j = Math.floor((i * from.length) / to.length)
    to[i] = from[j]
  }
  return to
}

/**
 * Interpolate between two values
 */
function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1
}

/**
 * Resample an array using a linear interpolation
 * @param {number[]} from
 * @param {number[]} to
 */
export function linearResample(from, to) {
  console.debug('#linearResample', from.length, to.length)
  for (let i = 0; i < to.length; i++) {
    const pivot = (i * from.length) / to.length

    const j0 = Math.floor(pivot)
    const ratio = pivot - j0

    const j1 = Math.min(from.length - 1, j0 + 1)

    to[i] = lerp(from[j0], from[j1], ratio)
  }
  return to
}

const MAX_FACTOR = 2 ** 15

/** @param {Float32Array} float32s */
export function float32ToInt16(float32s) {
  const output = new Int16Array(float32s.length)

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.trunc(float32s[i] * (MAX_FACTOR * 0.5))
  }

  return output
}

/** @param {Int16Array} int16s */
export function int16ToFloat32(int16s) {
  const output = new Float32Array(int16s.length)

  for (let i = 0; i < output.length; i++) {
    output[i] = int16s[i] / MAX_FACTOR
  }

  return output
}
