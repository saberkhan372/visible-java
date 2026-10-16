// Session 3 checkpoint: the supported missions done.
// Four balls in a small array, each with its own position, speed, and size.
// Session 4 starts from this sketch.

Ball[] balls = new Ball[4];

void setup() {
  size(400, 400);
  balls[0] = new Ball(60, 60, 2, 1.5, 40);
  balls[1] = new Ball(300, 100, -3, 2, 60);
  balls[2] = new Ball(200, 300, 1, -2.5, 30);
  balls[3] = new Ball(100, 250, -1.5, -1, 80);
}

void draw() {
  background(255);
  for (int i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].show();
  }
}

class Ball {
  float x;
  float y;
  float xSpeed;
  float ySpeed;
  float diameter;

  Ball(float startX, float startY, float startXSpeed, float startYSpeed, float startDiameter) {
    x = startX;
    y = startY;
    xSpeed = startXSpeed;
    ySpeed = startYSpeed;
    diameter = startDiameter;
  }

  void move() {
    x = x + xSpeed;
    y = y + ySpeed;
    float r = diameter / 2;
    if (x > width - r || x < r) {
      xSpeed = -xSpeed;
    }
    if (y > height - r || y < r) {
      ySpeed = -ySpeed;
    }
  }

  void show() {
    circle(x, y, diameter);
  }
}
