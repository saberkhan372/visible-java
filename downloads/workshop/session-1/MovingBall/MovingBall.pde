// Session 1 starter: something that moves.
// Press Run. Then change one number at a time and predict before you run again.

float y = 0;

void setup() {
  size(400, 400);
}

void draw() {
  background(255);
  circle(200, y, 40);
  y = y + 2;
}
