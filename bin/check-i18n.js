#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const dot = require('dot-prop')

async function loadYaml(filename) {
  return fs.promises
    .readFile(path.join(__dirname, '../src/i18n', filename), 'utf8')
    .then((d) => yaml.parse(d))
}

function flattenKeys(object, history = []) {
  const keys = []
  if (object === null || object === undefined) return keys

  for (const [key, value] of Object.entries(object)) {
    if (typeof value !== 'object') {
      keys.push(history.concat(key).join('.'))
    } else {
      keys.push(...flattenKeys(value, history.concat([key])))
    }
  }
  return keys
}

function findMissing(mainset, subset) {
  const missing = []
  for (const key of mainset) {
    if (!subset.has(key)) missing.push(key)
  }
  return missing
}

function removeAllowListed(array) {
  const allowlist = [
    /^interpret\./i,
    /^interpretHome\./i,
    /^interpretSchedule\./i,
  ]

  return array.filter((key) =>
    allowlist.every((regex) => regex.test(key) == false)
  )
}

async function main() {
  try {
    const input = ['en.yml', 'fr.yml', 'es.yml', 'ar.yml']

    const task = input.map(async function* (filename) {
      const yaml = await loadYaml(filename)
      const keys = flattenKeys(yaml)
      const keySet = new Set(keys)

      const en = yield yaml

      const allSet = yield keys

      const missing = removeAllowListed(findMissing(allSet, keySet))

      if (missing.length > 0) {
        console.log(`${filename} is missing:`)

        for (const key of missing) {
          const value = dot.get(en, key) || ''
          console.log(' -', key + `\n   en: ${value}\n`)
        }
      } else {
        console.log(`${filename} is good`)
      }
      console.log()
    })

    // Load up and get en out of them first
    const [en] = await Promise.all(task.map((t) => t.next()))

    // Then get flattened keys
    const keyResult = await Promise.all(task.map((t) => t.next(en.value)))

    // Then run to completion
    const allKeys = new Set(keyResult.map((it) => it.value).flat())

    await task.forEach((it) => it.next(allKeys))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
