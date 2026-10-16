// Session 2 demo: one ball moving sideways toward a wall, one frame per second.
// It prints x and xSpeed after each frame's decision, and stops after six frames.

float x = 350;
float xSpeed = 15;

void setup() {
  size(400, 400);
  frameRate(1);
}

void draw() {
  background(255);
  circle(x, 200, 40);
  x = x + xSpeed;
  if (x > width - 20 || x < 20) {
    xSpeed = -xSpeed;
  }
  println("frame " + frameCount + ": x = " + x + ", xSpeed = " + xSpeed);
  if (frameCount == 6) {
    noLoop();
  }
}
