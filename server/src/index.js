// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { WebSocketServer } from 'ws'
import { Config } from './config.js'

const server = new WebSocketServer({ port: Config.server.port })
const clients = []

// Dummy
let speed = 5
let x = Config.environment.width / 2
let y = Config.environment.height / 2
setInterval(() => {
  x += Math.random() * speed - speed / 2
  y += Math.random() * speed - speed / 2
  x = Math.max(0, Math.min(x, Config.environment.width))
  y = Math.max(0, Math.min(y, Config.environment.height))
  if (clients.length === 0) return
  console.log(`Sending position: ${x}, ${y}`)
  clients.forEach((client) => {
    const payload = {
      type: 'position',
      data: { x, y }
    }
    client.send(JSON.stringify(payload))
  })
}, 100)

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