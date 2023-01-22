// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { WebSocketServer } from 'ws'
import { Config } from '../config.js'

export class Server {
  constructor(log) {
    this.log = log.extend('server')
    this.sockets = []
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.server = new WebSocketServer({ port: Config.server.port })
      this.server.on('listening', () => {
        this.log.info(`Server started on port ${Config.server.port}`)
        return resolve()
      })
      this.server.on('connection', (socket) => this.onServerConnection(socket))
      this.server.on('error', (error) => this.onServerError(error))
    })
  }

  onServerConnection(socket) {
    this.log.info(`Client connected: ${socket._socket.remoteAddress}`)
    socket.on('message', (message) => this.onSocketMessage(socket, message))
    socket.on('error', (error) => this.onSocketError(socket, error))
    socket.on('close', () => this.onSocketClose(socket))
    this.addSocket(socket)
  }

  onServerError(error) {
    this.log.error(`Server error: ${error}`)
  }

  onSocketMessage(socket, message) {
    this.log.info(`Received message: ${message}`)
    // TODO: do we expect messages from the client?
  }

  onSocketError(socket, error) {
    this.log.error(`Socket error: ${error}`)
  }

  onSocketClose(socket) {
    this.log.info(`Client disconnected: ${socket._socket.remoteAddress}`)
    this.removeSocket(socket)
  }

  addSocket(socket) {
    this.sockets.push(socket)
  }

  removeSocket(socket) {
    this.sockets.splice(this.sockets.indexOf(socket), 1)
  }

  hasConnectedSockets() {
    return this.sockets.length !== 0
  }

  broadcast(message) {
    if (this.sockets.length === 0) return
    if (message instanceof Object) message = JSON.stringify(message)
    this.log.info(`Sending broadcast to ${this.sockets.length} clients (${message.length} bytes)`)
    this.sockets.forEach(socket => socket.send(message))
  }
}
