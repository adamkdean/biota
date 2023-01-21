// Copyright (C) 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

(function(){
  var nativeLog = console.log
  console.log = function (message) {
    newLog(message)
    nativeLog.apply(console, arguments)
  }
})()

function newLog(message) {
  // Format message
  const now = new Date()
  const time = now.toLocaleTimeString('en-GB', { hour12: false })
  const ms = now.getMilliseconds().toString().padStart(3, '0')
  message = `${time}.${ms} ${message}`

  // Append to console
  const logContainer = document.getElementById('log')
  const p = document.createElement('p')
  p.innerText = message
  logContainer.appendChild(p)
  logContainer.scrollTop = logContainer.scrollHeight

  // Truncate console if too long
  const maxLines = 100
  const lines = logContainer.getElementsByTagName('p')
  if (lines.length > maxLines) logContainer.removeChild(lines[0])
}
