// Session 1, predict step: the same ball, slowed to one frame per second.
// Predict each console line before it appears.

float y = 0;

void setup() {
  size(400, 400);
  frameRate(1);
}

void draw() {
  background(255);
  circle(200, y, 40);
  println("frame " + frameCount + ": drew at y = " + y);
  y = y + 2;
  if (frameCount == 5) {
    noLoop();
    println("after frame 5, y = " + y);
  }
}
