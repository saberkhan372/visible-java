// Session 1, port step: the FrameByFrame sketch in standard Java.
// No window and no hidden loop. You write the loop, and each frame becomes a line of text.
// Its output should match the Processing console line for line.

public class MovingBall {

  public static void main(String[] args) {
    double y = 0;

    for (int frame = 1; frame <= 5; frame++) {
      System.out.println("frame " + frame + ": drew at y = " + y);
      y = y + 2;
    }
    System.out.println("after frame 5, y = " + y);
  }
}
