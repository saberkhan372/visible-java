// Session 2 starter: Session 1's checkpoint ball, plus one decision.
// Predict what the new if does before you press Run.

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
  if (y > height - 20) {
    ySpeed = -ySpeed;
  }
}
