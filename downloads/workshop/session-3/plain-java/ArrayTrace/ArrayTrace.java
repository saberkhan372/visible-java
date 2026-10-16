// Session 3, Java transfer: a small array of objects, traversed twice.
// Trace it on paper first: where is each ball after two frames, and what is printed?

public class ArrayTrace {

  public static void main(String[] args) {
    Ball[] balls = new Ball[4];
    balls[0] = new Ball(370, 100, 10, 0);
    balls[1] = new Ball(200, 200, -50, 0);
    balls[2] = new Ball(30, 300, -10, 0);
    balls[3] = new Ball(190, 50, 10, 0);

    for (int frame = 1; frame <= 2; frame++) {
      for (int i = 0; i < balls.length; i++) {
        balls[i].move();
      }
    }

    int right = 0;
    int farthest = 0;
    for (int i = 0; i < balls.length; i++) {
      System.out.println("balls[" + i + "].x = " + balls[i].getX());
      if (balls[i].getX() > 200) {
        right++;
      }
      if (balls[i].getX() > balls[farthest].getX()) {
        farthest = i;
      }
    }
    System.out.println(right + " in the right half; farthest right is balls[" + farthest + "]");
  }
}

class Ball {
  private double x;
  private double y;
  private double xSpeed;
  private double ySpeed;

  public Ball(double startX, double startY, double startXSpeed, double startYSpeed) {
    x = startX;
    y = startY;
    xSpeed = startXSpeed;
    ySpeed = startYSpeed;
  }

  /** One frame of motion in a 400 by 400 window: move, then turn around at any wall. */
  public void move() {
    x = x + xSpeed;
    y = y + ySpeed;
    if (x > 380 || x < 20) {
      xSpeed = -xSpeed;
    }
    if (y > 380 || y < 20) {
      ySpeed = -ySpeed;
    }
  }

  public double getX() {
    return x;
  }
}
