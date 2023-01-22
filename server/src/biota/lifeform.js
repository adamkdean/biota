// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { v4 as uuidv4 } from 'uuid'
import { Config } from '../config.js'

export class Lifeform {
  constructor(params) {
    this.id = uuidv4()
    this.shortId = `${this.id.substring(0, 4)}-${this.id.substring(this.id.length - 4, this.id.length)}`
    this.x = params.x
    this.y = params.y
    this.size = params.size || 10
    this.speed = params.speed || 10
    this.color = params.color || { r: 255, g: 255, b: 255 }
  }

  initialize(log, world) {
    this.world = world
    this.log = log.extend('lifeform').extend(this.shortId)
    this.log.info('Initialized')
  }

  update() {
    this.log.info('Updating')

    // DEBUG
    this.x += Math.random() * this.speed - this.speed / 2
    this.y += Math.random() * this.speed - this.speed / 2
    this.x = Math.max(0, Math.min(this.x, Config.environment.width))
    this.y = Math.max(0, Math.min(this.y, Config.environment.height))
    this.x = Math.round(this.x * 100) / 100
    this.y = Math.round(this.y * 100) / 100
  }

  destroy() {
    this.log.info('Destroyed')
  }

  serialize() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      size: this.size,
      color: this.color
    }
  }
}