// Session 3 demo: two objects from one class, one frame per second.
// Both move sideways only, so x is the whole story. It stops after five frames.

Ball a;
Ball b;

void setup() {
  size(400, 400);
  frameRate(1);
  a = new Ball(350, 120, 15, 0);
  b = new Ball(100, 280, -10, 0);
}

void draw() {
  background(255);
  a.move();
  b.move();
  a.show();
  b.show();
  println("frame " + frameCount + ": a.x = " + a.x + ", b.x = " + b.x);
  if (frameCount == 5) {
    noLoop();
  }
}

class Ball {
  float x;
  float y;
  float xSpeed;
  float ySpeed;

  Ball(float startX, float startY, float startXSpeed, float startYSpeed) {
    x = startX;
    y = startY;
    xSpeed = startXSpeed;
    ySpeed = startYSpeed;
  }

  void move() {
    x = x + xSpeed;
    y = y + ySpeed;
    if (x > width - 20 || x < 20) {
      xSpeed = -xSpeed;
    }
    if (y > height - 20 || y < 20) {
      ySpeed = -ySpeed;
    }
  }

  void show() {
    circle(x, y, 40);
  }
}
