// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import dotenv from 'dotenv'
dotenv.config()

export const Config = {
  server: {
    port: parseInt(process.env.PORT) || 8001
  },
  environment: {
    width: parseInt(process.env.ENVIRONMENT_WIDTH) || 960,   // MUST MATCH CLIENT
    height: parseInt(process.env.ENVIRONMENT_HEIGHT) || 600, // MUST MATCH CLIENT
  }
}
