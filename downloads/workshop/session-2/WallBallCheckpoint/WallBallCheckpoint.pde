// Session 2 checkpoint: the supported missions done.
// Four walls, a pause key, and a row of cells that shows which column the ball is in.
// Session 3 starts from this sketch.

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

  int col = int(x / 40);
  for (int i = 0; i < 10; i++) {
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
    if (x > width - 20 || x < 20) {
      xSpeed = -xSpeed;
    }
    if (y > height - 20 || y < 20) {
      ySpeed = -ySpeed;
    }
  }
}

void keyPressed() {
  if (key == 'p') {
    paused = !paused;
  }
}
