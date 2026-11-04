// Session 1 concept: integer division you can see.
// Move the mouse. Why won't the eyes follow it?
// Predict what changes if you write 1.0 / 2 instead of 1 / 2. Then try it.

void setup() {
  size(400, 400);
}

void draw() {
  background(255);
  circle(200, 200, 240);

  float eyeShift = 1 / 2 * mouseX;
  circle(150 + eyeShift / 10, 170, 30);
  circle(250 + eyeShift / 10, 170, 30);
}
