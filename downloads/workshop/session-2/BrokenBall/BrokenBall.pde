// Session 2 debugging lab: this sketch should behave exactly like WallBallCheckpoint.
// It has three bugs: one in a condition, one in a loop, and one in how it reads a key.
// Find each one by watching what the sketch does, not by comparing the code line by line.

float x = 40;
float y = 40;
float xSpeed = 1.5;
float ySpeed = 2;
boolean paused = false;

void setup() {
  size(400, 400);
}

void draw() {
  background(255);

  if (keyPressed && key == 'p') {
    paused = !paused;
  }

  int col = int(x / 40);
  for (int i = 0; i < 9; i++) {
    if (i == col) {
      fill(0);
    } else {
      fill(255);
    }
    rect(i * 40, 390, 40, 10);
  }

  fill(255);
  circle(x, y, 40);

  if (!paused) {
    x = x + xSpeed;
    y = y + ySpeed;
    if (x > width - 20 && x < 20) {
      xSpeed = -xSpeed;
    }
    if (y > height - 20 || y < 20) {
      ySpeed = -ySpeed;
    }
  }
}
