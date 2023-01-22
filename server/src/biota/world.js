// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { Config } from '../config.js'

export class World {
  constructor(log, server) {
    this.rootLog = log
    this.log = log.extend('world')
    this.server = server
  }

  initialize() {
    this.log.info('Setting up world')
    this.reset()
    if (this.interval) clearInterval(this.interval)
    this.interval = setInterval(() => this.update(), Config.environment.updateInterval)
  }

  reset() {
    this.log.info('Resetting world')
    this.epoch = 0
    this.lifeforms = []
  }

  update() {
    this.log.info(`Epoch ${this.epoch}`)
    this.lifeforms.forEach(lifeform => lifeform.update())
    this.epoch++
    this.sendUpdate()
  }

  sendUpdate() {
    if (!this.server.hasConnectedSockets()) return

    const update = {
      type: 'update',
      epoch: this.epoch,
      lifeforms: this.lifeforms.map(lifeform => lifeform.serialize())
    }

    this.server.broadcast(update)
  }

  addLifeform(lifeform) {
    lifeform.initialize(this.rootLog, this)
    this.lifeforms.push(lifeform)
  }

  removeLifeform(lifeform) {
    lifeform.destroy()
    this.lifeforms.splice(this.lifeforms.indexOf(lifeform), 1)
  }
}