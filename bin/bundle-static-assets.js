#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

const axios = require('axios').default
const fs = require('fs/promises')
const path = require('path')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const USAGE = `
Usage: node bin/bundle-site.js <auth_token> [api_url] [cdn_remote]

Arguments:
  auth_token API authentication token (localStorage.token when signed in)
  api_url    URL to the running API instance
  cdn_remote Git remote url to clone locally the schedule repo
`.trim()

function staticDir(...inputPaths) {
  return path.join('public', ...inputPaths)
}

async function downloadFromAPI(authToken, apiUrl) {
  const agent = axios.create({
    baseURL: apiUrl,
    headers: {
      authorization: `bearer ${authToken}`,
    },
  })

  const dataset = [
    { slug: 'schedule/slots' },
    { slug: 'schedule/sessions' },
    { slug: 'schedule/settings' },
    { slug: 'schedule/speakers' },
    { slug: 'schedule/themes' },
    { slug: 'schedule/tracks' },
    { slug: 'schedule/types' },
  ]

  for (const item of dataset) {
    const response = await agent.get(item.slug)
    const dest = staticDir('api', item.slug + '.json')
    const directory = path.dirname(dest)

    await fs.mkdir(directory, { recursive: true })

    await fs.writeFile(dest, JSON.stringify(response.data, null, 2))
  }
}

async function downloadFromCDN(cdnRemote) {
  const tempDir = await fs.mkdtemp('cdn_')

  try {
    // Clone the repo
    await exec(`git clone ${cdnRemote} ${tempDir}`)

    // Copy images to static folder
    const uploads = path.join(tempDir, 'uploads/')
    const destination = staticDir('uploads')
    await exec(`cp -R ${uploads} ${destination}`)
  } finally {
    // Remove the repo clone
    await exec(`rm -r ${tempDir}`)
  }
}

async function main() {
  if (process.argv.includes('--help') || process.argv.length < 3) {
    console.log(USAGE)
    process.exit(1)
  }

  const [
    authToken,
    apiUrl = 'http://localhost:3000/',
    cdnRemote = 'git@github.com:digitalinteraction/climatered-schedule.git',
  ] = process.argv.slice(2)

  await downloadFromAPI(authToken, apiUrl)
  await downloadFromCDN(cdnRemote)
}

main(...process.argv.slice(2)).catch((error) => {
  console.error(error.message)
  console.error(error.stack)
  process.exit(1)
})
