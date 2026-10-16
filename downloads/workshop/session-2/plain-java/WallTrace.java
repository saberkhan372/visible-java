// Session 2, Java transfer: the WallTrace sketch in standard Java.
// Its output should match the Processing console line for line.

public class WallTrace {

  public static void main(String[] args) {
    double x = 350;
    double xSpeed = 15;

    for (int frame = 1; frame <= 6; frame++) {
      x = x + xSpeed;
      if (x > 380 || x < 20) {
        xSpeed = -xSpeed;
      }
      System.out.println("frame " + frame + ": x = " + x + ", xSpeed = " + xSpeed);
    }
  }
}
