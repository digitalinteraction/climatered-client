#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yaml = require('yaml')

async function loadYaml(filename) {
  return fs.promises
    .readFile(path.join(__dirname, '../src/i18n', filename), 'utf8')
    .then(d => yaml.parse(d))
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
  const allowlist = [/^interpret\./i]

  return array.filter(key => allowlist.every(regex => regex.test(key) == false))
}

async function main() {
  try {
    const input = ['en.yml', 'fr.yml', 'es.yml', 'ar.yml']

    const task = input.map(async function*(filename) {
      const yaml = await loadYaml(filename)
      const keys = flattenKeys(yaml)
      const keySet = new Set(keys)

      const allSet = yield keys

      const missing = removeAllowListed(findMissing(allSet, keySet))

      if (missing.length > 0) {
        console.log(`${filename} is missing:`)
        missing.forEach(k => console.log(' -', k))
      } else {
        console.log(`${filename} is good`)
      }
      console.log()
    })

    const keyResult = await Promise.all(task.map(t => t.next()))

    const allKeys = new Set(keyResult.map(it => it.value).flat())

    task.forEach(it => it.next(allKeys))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
