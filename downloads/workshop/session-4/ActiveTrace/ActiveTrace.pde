// Session 4 demo: the starter, plus a console report.
// Each frame it counts the active balls, and prints a line whenever that count changes.

ArrayList<Ball> balls = new ArrayList<Ball>();
int lastActive = 4;

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
  int active = 0;
  for (Ball b : balls) {
    if (b.bounces < 3) {
      active = active + 1;
    }
  }
  if (active != lastActive) {
    println("frame " + frameCount + ": " + active + " active");
    lastActive = active;
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
