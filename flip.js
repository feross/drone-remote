var arDrone = require('ar-drone')
var client = arDrone.createClient()

client.takeoff()
client.after(2000, function () {
  this.up(0.4)
})
.after(3000, function () {
  this.stop()
  this.animate('flipAhead', 2000)
})
.after(5000, function () {
  this.land()
})