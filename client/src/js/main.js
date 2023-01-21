// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const SERVER_PORT = 8001

//
// P5.js
//
function setup() {
  const display = document.getElementById('display')
  const canvas = createCanvas(display.clientWidth, display.clientHeight)
  canvas.parent(display)
  console.log('Display initialized')
  connect()
}

function draw() {
  background(255)
}

//
// WebSocket
//
function connect() {
  const host = window.location.host.split(':')[0]
  console.log(`Connecting to server ${host}:${SERVER_PORT}`)

  const socket = new WebSocket(`ws://${host}:${SERVER_PORT}`)
  socket.onopen = onConnected
  socket.onclose = onDisconnected
  socket.onmessage = onMessage
  socket.onerror = onError
}

function onConnected() {
  console.log('Connected to server')
}

function onMessage(event) {
  console.log(`> ${event.data}`)
}

function onDisconnected() {
  console.log('Disconnected from server')
}

function onError(error) {
  console.log(`Error: ${error}`)
}