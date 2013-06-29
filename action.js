var arDrone = require('ar-drone')
var tty = require('tty')
var client = arDrone.createClient()

// client.on('navdata', console.log.bind(console))

client.disableEmergency()
client.stop()
client.takeoff()

client.on('batteryChange', function (num) {
  console.log('battery: ' + num)
})

var speed = 0.1

var x = 0
var y = 0
var z = 0
var rot = 0

process.stdin.setRawMode(true)

process.stdin.on('data', function(chunk) {
  var key = chunk.toString()
  var keyBuf = chunk.toJSON()

  console.log(key)
  console.log(keyBuf)

  if (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 65) {
    changeY(speed) // FORWARD

  } else if (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 66) {
    changeY(-speed) // BACK

  } else if (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 67) {
    changeX(speed) // RIGHT

  } else if (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 68) {
    changeX(-speed) // LEFT

  } else if (key === 'w') {
    changeZ(speed) // UP

  } else if (key === 's') {
    changeZ(-speed) // DOWN

  } else if (key === 'a') {
    changeRotation(speed) // ROTATE CLOCKWISE

  } else if (key === 'd') {
    changeRotation(-speed) // ROTATE COUNTERCLOCKWISE

  } else if (key === 'q') {
    client.land()

  } else if (key === 'k') {
    client.land()
    setTimeout(function () {
      process.exit(0)
    }, 200)

  } else if (key === 'e') {
    client.stop()

  } else if (key === 't') {
    client.disableEmergency()
    client.stop()
    client.takeoff()

  } else if (keyBuf[0] === 32) {
    client.animate('flipAhead', 1000)

    client
      .after(750, function () {
        client.down(1)
      })
      .after(300, function () {
        client.down(0)
      })

  } else if (keyBuf[0] === 9) { // TAB
    // SCARE
    client.front(1)
    client
      .after(1000, function () {
        client.back(1)
      })
      .after(2000, function () {
        client.stop()
      })
  }

})

function changeRotation (val) {
  rot += val
  if (rot > 1) rot = 1
  if (rot < -1) rot = -1

  if (rot >= 0) {
    client.clockwise(rot)
  } else {
    client.counterClockwise(rot * -1)
  }
}

function changeX(val) {
  x += val
  if (x > 1) x = 1
  if (x < -1) x = -1

  if (x >= 0) {
    client.right(x)
  } else {
    client.left(x * -1)
  }
}

function changeY(val) {
  y += val
  if (y > 1) y = 1
  if (y < -1) y = -1

  console.log(y)
  if (y >= 0) {
    client.front(y)
  } else {
    client.back(y * -1)
  }
}

function changeZ(val) {
  z += val
  if (z > 1) z = 1
  if (z < -1) z = -1

  console.log(z)
  if (z >= 0) {
    client.up(z)
  } else {
    client.down(z * -1)
  }
}