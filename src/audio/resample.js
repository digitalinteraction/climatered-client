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
  for (let i = 0; i < to.length; i++) {
    const j = Math.floor((i / to.length) * from.length)
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
  for (let i = 0; i < to.length; i++) {
    const pivot = (i * from.length) / to.length

    const j0 = Math.floor(pivot)
    const ratio = pivot - j0

    const j1 = Math.min(from.length - 1, j0 + 1)

    to[i] = lerp(from[j0], from[j1], ratio)
  }
  return to
}
