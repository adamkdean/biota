// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

const SERVER_PORT = 8001

let objects = []

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
  if (objects.length > 0) {
    objects.forEach((o) => {
      fill(o.color.r, o.color.g, o.color.b)
      ellipse(o.x, o.y, 10, 10)
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
}

function onMessage(event) {
  // console.debug(`${event.data}`)
  // if event is JSON then parse otherwise ignore
  try {
    const msg = JSON.parse(event.data)
    if (!msg.type) return

    if (msg.type === 'objects') {
      objects = msg.data
      console.log(`Received ${objects.length} objects`)
    }
  } catch (error) {
    console.log(`Error parsing incoming message: ${error}`)
  }
}

function onDisconnected() {
  console.log('Disconnected from server')
}

function onError(error) {
  console.log(`Error: ${error}`)
}