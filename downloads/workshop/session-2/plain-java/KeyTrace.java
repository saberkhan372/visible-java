// Session 2, Java transfer: the pause key with no keyboard.
// The keys arrive as data, one character per frame. A '.' means no key that frame.
// Predict every line before you run it.

public class KeyTrace {

  public static void main(String[] args) {
    String keys = "..p.p...";
    double x = 350;
    double xSpeed = 15;
    boolean paused = false;

    for (int frame = 1; frame <= keys.length(); frame++) {
      char key = keys.charAt(frame - 1);
      if (key == 'p') {
        paused = !paused;
      }
      if (!paused) {
        x = x + xSpeed;
        if (x > 380 || x < 20) {
          xSpeed = -xSpeed;
        }
      }
      System.out.println("frame " + frame + ": x = " + x + ", paused = " + paused);
    }
  }
}
