// Session 2 completed example: the checkpoint plus both independent extensions.
// Click to place the ball. Press f for faster, s for slower, p to pause.

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
  } else if (key == 'f') {
    xSpeed = xSpeed * 2;
    ySpeed = ySpeed * 2;
  } else if (key == 's') {
    xSpeed = xSpeed / 2;
    ySpeed = ySpeed / 2;
  }
}

void mousePressed() {
  x = constrain(mouseX, 20, width - 20);
  y = constrain(mouseY, 20, height - 20);
}
