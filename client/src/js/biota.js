// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

function setup() {
  const display = document.getElementById('display')
  const canvas = createCanvas(display.clientWidth, display.clientHeight)
  canvas.parent(display)
  console.log('Setup complete')
}

function draw() {
  background(255)
}
