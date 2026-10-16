// Session 5 studio, optional hardware extension: a stand-in for a sensor.
// readSensor() returns a number from 0 to 1023, the range an Arduino analog pin reports.
// Here the number comes from the mouse, so the lesson works with no hardware at all.
// To use a real sensor, replace the body of readSensor() with a value read through
// Processing's Serial library. Nothing else in the sketch has to change.

float x = 200;
float xSpeed = 0;

void setup() {
  size(400, 400);
  textSize(16);
}

void draw() {
  background(255);
  int reading = readSensor();
  xSpeed = map(reading, 0, 1023, -6, 6);
  x = x + xSpeed;
  if (x > width - 20) {
    x = width - 20;
  }
  if (x < 20) {
    x = 20;
  }
  fill(0);
  text("sensor: " + reading, 10, 25);
  fill(255);
  circle(x, 200, 40);
}

int readSensor() {
  return int(map(mouseX, 0, width, 0, 1023));
}
