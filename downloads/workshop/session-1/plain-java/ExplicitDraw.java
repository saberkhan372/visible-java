// Session 1, Java transfer: in Processing, something else calls draw().
// In plain Java nothing does, so main calls it, five times, by name.

public class ExplicitDraw {

  static double y = 0;

  static void draw() {
    System.out.println("drew at y = " + y);
    y = y + 2;
  }

  public static void main(String[] args) {
    draw();
    draw();
    draw();
    draw();
    draw();
    System.out.println("after five calls, y = " + y);
  }
}
