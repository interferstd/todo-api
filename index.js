const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const api = require('./api')

const server = express()

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server
  const address = `http://${host}:${port}`

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Set application
  api.installOn(server)

  // Give nuxt middleware to express
  server.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on ${address}`,
    badge: true
  })
}
start()
