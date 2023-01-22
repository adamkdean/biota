// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { Log, StdioAdaptor } from '@edge/log'
import { Server } from './server/index.js'
import { World } from './biota/world.js'
import { Lifeform } from './biota/lifeform.js'

// Setup log instance
const log = new Log()
log.use(new StdioAdaptor())

// Dummy lifeform
const dummy = new Lifeform({
  x: 100, y: 100,
  color: { r: 255, g: 0, b: 0 }
})

// Initialize biota
const server = new Server(log)
const world = new World(log, server)
server.initialize()
world.initialize()
world.addLifeform(dummy)
