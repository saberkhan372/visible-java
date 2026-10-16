// Session 3 optional extension: a 2D array of balls.
// Each ball starts at the center of its own cell in a 3 by 3 grid.
// Row decides the vertical speed and column decides the horizontal speed.

Ball[][] grid = new Ball[3][3];

void setup() {
  size(400, 400);
  for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
      grid[row][col] = new Ball(70 + col * 130, 70 + row * 130, col - 1, row - 1, 40);
    }
  }
}

void draw() {
  background(255);
  for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
      grid[row][col].move();
      grid[row][col].show();
    }
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
