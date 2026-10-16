// Session 3, Java transfer: the ObjectTrace sketch in standard Java.
// Its output should match the Processing console line for line.
// In a classroom, Ball would live in its own file, Ball.java.

public class BallWorld {

  public static void main(String[] args) {
    Ball a = new Ball(350, 120, 15, 0);
    Ball b = new Ball(100, 280, -10, 0);
    for (int frame = 1; frame <= 5; frame++) {
      a.move();
      b.move();
      System.out.println("frame " + frame + ": a.x = " + a.getX() + ", b.x = " + b.getX());
    }
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

  public double getY() {
    return y;
  }
}
