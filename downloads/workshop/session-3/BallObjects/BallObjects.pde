// Session 3 starter: Session 2's ball, turned into a class.
// The state and the wall rules are written once, inside Ball. Two objects use them.

Ball a;
Ball b;

void setup() {
  size(400, 400);
  a = new Ball(40, 40, 1.5, 2);
  b = new Ball(300, 100, -3, 1);
}

void draw() {
  background(255);
  a.move();
  b.move();
  a.show();
  b.show();
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
