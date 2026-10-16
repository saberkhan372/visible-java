// Session 1 stretch, and a preview of Session 3: the same state, moved into a class.
// In a classroom, Ball would live in its own file, Ball.java.

public class BallWorld {

  public static void main(String[] args) {
    Ball b = new Ball(360, 15);
    for (int frame = 1; frame <= 6; frame++) {
      b.move();
      System.out.println("frame " + frame + ": y = " + b.getY() + ", speed = " + b.getSpeed());
    }
  }
}

class Ball {
  private double y;
  private double speed;

  public Ball(double startY, double startSpeed) {
    y = startY;
    speed = startSpeed;
  }

  /** One frame of motion: move, then turn around at an edge. */
  public void move() {
    y = y + speed;
    if (y > 380 || y < 20) {
      speed = -speed;
    }
  }

  public double getY() {
    return y;
  }

  public double getSpeed() {
    return speed;
  }
}
