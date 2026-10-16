// Session 4, Java transfer: the whole sketch's behavior, with its drawing removed.
// The collection is prepared for you. countActive() is the query to write.
// main runs the model until every ball has stopped. Its output should match the
// ActiveTrace console line for line.
// Compile with Ball.java in the same folder: javac *.java, then java BallModel

import java.util.ArrayList;

public class BallModel {
  private ArrayList<Ball> balls;
  private int width;
  private int height;

  public BallModel(int w, int h) {
    balls = new ArrayList<Ball>();
    width = w;
    height = h;
  }

  /** Adds the four starting balls, the same ones the sketch starts with. */
  public void addStartingBalls() {
    balls.add(new Ball(60, 200, 4, 0));
    balls.add(new Ball(200, 60, 0, -3));
    balls.add(new Ball(300, 300, -5, 5));
    balls.add(new Ball(120, 330, 2, 6));
  }

  public void add(Ball b) {
    balls.add(b);
  }

  public int size() {
    return balls.size();
  }

  /** Moves every ball one frame. */
  public void step() {
    for (Ball b : balls) {
      b.move(width, height);
    }
  }

  /** Returns how many balls are still active. */
  public int countActive() {
    int count = 0;
    for (Ball b : balls) {
      if (b.isActive()) {
        count++;
      }
    }
    return count;
  }

  /** Removes every ball that is no longer active. Returns how many it removed. */
  public int removeInactive() {
    int removed = 0;
    for (int i = balls.size() - 1; i >= 0; i--) {
      if (!balls.get(i).isActive()) {
        balls.remove(i);
        removed++;
      }
    }
    return removed;
  }

  public static void main(String[] args) {
    BallModel model = new BallModel(400, 400);
    model.addStartingBalls();

    int frame = 0;
    int active = model.countActive();
    while (active > 0) {
      frame++;
      model.step();
      int now = model.countActive();
      if (now != active) {
        System.out.println("frame " + frame + ": " + now + " active");
        active = now;
      }
    }
  }
}
