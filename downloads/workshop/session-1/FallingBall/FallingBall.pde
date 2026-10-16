// Session 1 completed example: the independent extension.
// ySpeed changes every frame too, so the ball speeds up like a thrown object.
// There is no background() in draw(), so every frame stays on screen as a trail.

float x = 40;
float y = 40;
float xSpeed = 2;
float ySpeed = 0;
float gravity = 0.2;

void setup() {
  size(400, 400);
  background(255);
}

void draw() {
  circle(x, y, 20);
  x = x + xSpeed;
  y = y + ySpeed;
  ySpeed = ySpeed + gravity;
}
