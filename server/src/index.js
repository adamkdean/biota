// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { WebSocketServer } from 'ws'
import { Config } from './config.js'

const server = new WebSocketServer({ port: Config.server.port })
const clients = []

// Dummy
let resets = -1
let epoch = 0
let counter = 0
const objects = []

let speed = 5
setInterval(() => {
  let added = 0
  let removed = 0

  if (objects.length === 0) {
    objects.push({
      id: counter++,
      x: Config.environment.width / 2,
      y: Config.environment.height / 2,
      age: 0,
      color: { r: 200, g: 200, b: 200 }
    })
    resets++
  }

  objects.forEach((o) => {
    // chance of duplicating current object
    if (Math.random() < 0.015) {
      const id = counter++
      objects.push({ id, x: o.x, y: o.y, age: 0, color: mutateColor(o) })
      added += 1
    }

    // Change position
    o.x += Math.random() * speed - speed / 2
    o.y += Math.random() * speed - speed / 2
    o.x = Math.max(0, Math.min(o.x, Config.environment.width))
    o.y = Math.max(0, Math.min(o.y, Config.environment.height))
    o.x = Math.round(o.x * 100) / 100
    o.y = Math.round(o.y * 100) / 100

    // Age
    o.age += 1
    if (o.age > 100) {
      objects.splice(objects.indexOf(o), 1)
      removed += 1
    }

    // % of dying is 1% per 100 other objects, e.g. 200 = 2%, 500 = 5%
    if (objects.length > 100 && Math.random() < 0.01 * objects.length) {
      if (Math.random() < 0.01 * objects.length) {
        objects.splice(objects.indexOf(o), 1)
        removed += 1
      }
    }
  })

  const payload = { type: 'objects', data: objects }
  if (clients.length > 0) sendToAllClients(payload)

  if (added > 0 || removed > 0) console.log(`${epoch++}        ${objects.length}        + ${added}    - ${removed}    ${resets}`)
}, Config.environment.updateInterval)

function mutateColor(o, amount = 1) {
  const color = { ...o.color }
  color.r += Math.random() > 0.5 ? amount : -amount
  color.g += Math.random() > 0.5 ? amount : -amount
  color.b += Math.random() > 0.5 ? amount : -amount
  color.r = Math.max(0, Math.min(color.r, 255))
  color.g = Math.max(0, Math.min(color.g, 255))
  color.b = Math.max(0, Math.min(color.b, 255))
  return color
}

function sendToAllClients(message) {
  clients.forEach((client) => {
    client.send(JSON.stringify(message))
  })
}

server.on('connection', (socket) => {
  console.log('Client connected')
  clients.push(socket)

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`)
    socket.send(`Echo: ${message}`)
  })

  socket.on('close', () => {
    console.log('Client disconnected')
    clients.splice(clients.indexOf(socket), 1)
  })
})

console.log(`Server started on port ${Config.server.port}`)