// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { WebSocketServer } from 'ws'
import { Config } from './config.js'

const server = new WebSocketServer({ port: Config.port })

server.on('connection', (socket) => {
  console.log('Client connected')

  setInterval(() => {
    socket.send(`Server time: ${new Date()}`)
  }, 1000)

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`)
    socket.send(`Echo: ${message}`)
  })

  socket.on('close', () => {
    console.log('Client disconnected')
  })
})

console.log(`Server started on port ${Config.port}`)