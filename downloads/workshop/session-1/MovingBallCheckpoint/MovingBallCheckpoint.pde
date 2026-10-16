// Session 1 checkpoint: the ball after the supported missions.
// Position and speed are both named state now, in two directions.
// Session 2 starts from this sketch.

float x = 0;
float y = 0;
float xSpeed = 1.5;
float ySpeed = 2;

void setup() {
  size(400, 400);
}

void draw() {
  background(255);
  circle(x, y, 40);
  x = x + xSpeed;
  y = y + ySpeed;
}
