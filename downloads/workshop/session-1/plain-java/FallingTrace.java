// Session 1, trace task: the FallingBall rule with whole numbers and no drawing.
// Predict all five lines before you run it. The order of the two updates matters.

public class FallingTrace {

  public static void main(String[] args) {
    int y = 0;
    int ySpeed = 0;
    int gravity = 2;

    for (int frame = 1; frame <= 5; frame++) {
      y = y + ySpeed;
      ySpeed = ySpeed + gravity;
      System.out.println("frame " + frame + ": y = " + y + ", ySpeed = " + ySpeed);
    }
  }
}
