var arDrone = require('ar-drone')
var tty = require('tty')
var client = arDrone.createClient()

// client.on('navdata', console.log.bind(console))

client.disableEmergency()
client.stop()
// client.takeoff()

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

  if (Array.isArray(keyBuf)) {
    var UP = (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 65)
    var DOWN = (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 66)
    var RIGHT = (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 67)
    var LEFT = (keyBuf[0] === 27 && keyBuf[1] === 91 && keyBuf[2] === 68)
  }

  if (key === 'w') {
    changeX(speed) // FORWARD

  } else if (key === 's') {
    changeX(-speed) // BACK

  } else if (key === 'd') {
    changeY(speed) // RIGHT

  } else if (key === 'a') {
    changeY(-speed) // LEFT

  } else if (UP) {
    changeZ(speed) // UP

  } else if (DOWN) {
    changeZ(-speed) // DOWN

  } else if (LEFT) {
    changeRotation(-speed) // ROTATE COUNTERCLOCKWISE

  } else if (RIGHT) {
    changeRotation(speed) // ROTATE CLOCKWISE

  } else if (key === 'e') {
    client.disableEmergency()

  } else if (key === 't') {
    client.stop()
    client.takeoff()

  } else if (key === 'l') {
    client.land()

  } else if (key === 'k') {
    client.land()
    setTimeout(function () {
      process.exit(0)
    }, 200)

  } else if (key === 'q') {
    client.stop()

  } else if (keyBuf[0] === 32) {
    client.animate('flipAhead', 500)

    client
      .after(750, function () {
        client.down(1)
      })
      .after(200, function () {
        client.down(0)
      })

  } else if (keyBuf[0] === 9) { // TAB
    // SCARE
    client.front(1)
    client
      .after(1000, function () {
        client.back(1)
      })
      .after(1500, function () {
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