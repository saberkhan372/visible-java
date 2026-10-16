// Session 4, Java transfer: tests for the model, with no window anywhere.
// Each test names one case. Predict PASS or FAIL for every line before you run it.
// Compile with Ball.java and BallModel.java in the same folder: javac *.java, then java BallModelTest

public class BallModelTest {

  public static void main(String[] args) {
    // isActive: the boundary at the third bounce
    Ball corner = new Ball(370, 370, 15, 15);
    corner.move(400, 400);
    check("a corner hit counts twice", 2, corner.getBounces());
    check("two bounces is still active", true, corner.isActive());

    Ball runner = new Ball(200, 200, 10, 0);
    for (int frame = 1; frame <= 100; frame++) {
      runner.move(400, 400);
    }
    check("after 100 frames, bounces", 3, runner.getBounces());
    check("after 100 frames, active", false, runner.isActive());

    // countActive: empty, all, some, none
    check("empty model, countActive", 0, new BallModel(400, 400).countActive());
    check("starting four, countActive", 4, stepped(0).countActive());
    check("after 91 frames, countActive", 3, stepped(91).countActive());
    check("after 265 frames, countActive", 0, stepped(265).countActive());

    // removeInactive: three stopped balls side by side
    BallModel late = stepped(260);
    check("after 260 frames, removeInactive", 3, late.removeInactive());
    check("after 260 frames, size after", 1, late.size());
  }

  /** Returns a model with the four starting balls, run for the given number of frames. */
  private static BallModel stepped(int frames) {
    BallModel model = new BallModel(400, 400);
    model.addStartingBalls();
    for (int frame = 1; frame <= frames; frame++) {
      model.step();
    }
    return model;
  }

  private static void check(String name, int expected, int actual) {
    report(name, expected == actual, "" + expected, "" + actual);
  }

  private static void check(String name, boolean expected, boolean actual) {
    report(name, expected == actual, "" + expected, "" + actual);
  }

  private static void report(String name, boolean passed, String expected, String actual) {
    String result = passed ? "PASS" : "FAIL";
    System.out.println(result + "  " + name + ": expected " + expected + ", got " + actual);
  }
}
