// Session 4 checkpoint: the supported missions done.
// Ball is now only a model: it never draws and never reads width or height.
// The sketch owns the picture (drawBall) and asks the collection a question (countActive).

ArrayList<Ball> balls = new ArrayList<Ball>();

void setup() {
  size(400, 400);
  textSize(16);
  balls.add(new Ball(60, 200, 4, 0));
  balls.add(new Ball(200, 60, 0, -3));
  balls.add(new Ball(300, 300, -5, 5));
  balls.add(new Ball(120, 330, 2, 6));
}

void draw() {
  background(255);
  for (Ball b : balls) {
    b.move(width, height);
    drawBall(b);
  }
  fill(0);
  text(countActive() + " active", 10, 25);
}

void drawBall(Ball b) {
  if (b.isActive()) {
    fill(255);
  } else {
    fill(180);
  }
  circle(b.x, b.y, 40);
}

int countActive() {
  int count = 0;
  for (Ball b : balls) {
    if (b.isActive()) {
      count = count + 1;
    }
  }
  return count;
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

  boolean isActive() {
    return bounces < 3;
  }

  void move(int w, int h) {
    if (isActive()) {
      x = x + xSpeed;
      y = y + ySpeed;
      if (x > w - 20 || x < 20) {
        xSpeed = -xSpeed;
        bounces = bounces + 1;
      }
      if (y > h - 20 || y < 20) {
        ySpeed = -ySpeed;
        bounces = bounces + 1;
      }
    }
  }
}
