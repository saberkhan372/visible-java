// Session 1, port step: the bounce rule with no drawing at all.
// Predict all six lines before you run it.

public class BounceTrace {

  public static void main(String[] args) {
    double y = 360;
    double speed = 15;

    for (int frame = 1; frame <= 6; frame++) {
      y = y + speed;
      if (y > 380 || y < 20) {
        speed = -speed;
      }
      System.out.println("frame " + frame + ": y = " + y + ", speed = " + speed);
    }
  }
}
