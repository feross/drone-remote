var dist = {
  x: 0,
  y: 0
}
var isReturning = false

var lastSample = Date.now()
client.on('navdata', function (data) {
  var logs = [
    'x=' + data.demo.xVelocity,
    ' y=' + data.demo.yVelocity,
    ' z=' + data.demo.zVelocity,
  ].join('')
  console.log(logs)
  console.dir(dist)

  var timeElapsed = Date.now() - lastSample
  var xDist = data.demo.xVelocity * (timeElapsed / 1000)
  var yDist = data.demo.yVelocity * (timeElapsed / 1000)
  var zDist = data.demo.zVelocity * (timeElapsed / 1000)

  dist.x += xDist
  dist.y += yDist

  lastSample = Date.now()

  if (!isReturning && dist.x >= 4000) {
    client.stop()
    isReturning = true
    dist.x = 0
    dist.y = 0
  }

  if (isReturning && dist.x <= -4000) {
    client.stop()
  }
})