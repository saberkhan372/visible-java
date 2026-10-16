// Session 4 starter: a prepared collection of four balls.
// Each ball counts its bounces and stops on its third, turning gray.
// The behavior and the drawing are mixed together inside Ball. Today you pull them apart.

ArrayList<Ball> balls = new ArrayList<Ball>();

void setup() {
  size(400, 400);
  balls.add(new Ball(60, 200, 4, 0));
  balls.add(new Ball(200, 60, 0, -3));
  balls.add(new Ball(300, 300, -5, 5));
  balls.add(new Ball(120, 330, 2, 6));
}

void draw() {
  background(255);
  for (Ball b : balls) {
    b.move();
    b.show();
  }
}

class Ball {
  float x;
  float y;
  float xSpeed;
  float ySpeed;
  int bounces;

  Ball(float startX, float startY, float startXSpeed, float startYSpeed) {
    x = startX;
    y = startY;
    xSpeed = startXSpeed;
    ySpeed = startYSpeed;
    bounces = 0;
  }

  void move() {
    if (bounces < 3) {
      x = x + xSpeed;
      y = y + ySpeed;
      if (x > width - 20 || x < 20) {
        xSpeed = -xSpeed;
        bounces = bounces + 1;
      }
      if (y > height - 20 || y < 20) {
        ySpeed = -ySpeed;
        bounces = bounces + 1;
      }
    }
  }

  void show() {
    if (bounces < 3) {
      fill(255);
    } else {
      fill(180);
    }
    circle(x, y, 40);
  }
}
