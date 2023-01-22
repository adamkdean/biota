// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const SERVER_PORT = 8001

let reconnectInterval = null
let lifeforms = []

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
  if (lifeforms.length > 0) {
    lifeforms.forEach((o) => {
      fill(o.color.r, o.color.g, o.color.b)
      ellipse(o.x, o.y, o.size, o.size)
    })
  }
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
  if (reconnectInterval) {
    clearInterval(reconnectInterval)
    reconnectInterval = null
  }
}

function onMessage(event) {
  console.debug(`${event.data}`)
  // if event is JSON then parse otherwise ignore
  try {
    const msg = JSON.parse(event.data)
    if (!msg.type || !msg.epoch || !msg.lifeforms) return

    if (msg.type === 'update') {
      lifeforms = msg.lifeforms
      console.log(`Received ${lifeforms.length} lifeforms for epoch ${msg.epoch}`)
    }
  } catch (error) {
    console.log(`Error parsing incoming message: ${error}`)
  }
}

function onDisconnected() {
  console.log('Disconnected from server')
  reconnectInterval = setInterval(connect, 1000)
}

function onError(error) {
  console.log(`Error: ${error}`)
}