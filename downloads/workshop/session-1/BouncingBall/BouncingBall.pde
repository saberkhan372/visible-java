// Session 1, change step: one possible answer to the bounce challenge.
// speed is state too. Flipping its sign turns the ball around.

float y = 20;
float speed = 2;

void setup() {
  size(400, 400);
}

void draw() {
  background(255);
  circle(200, y, 40);
  y = y + speed;
  if (y > height - 20 || y < 20) {
    speed = -speed;
  }
}
