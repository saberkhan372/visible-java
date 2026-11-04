// Session 1, Java transfer: the FaceDrift bug with no window.
// In Java, an int divided by an int is an int. Predict every line before you run it.

public class IntegerTrace {

  public static void main(String[] args) {
    int mouseX = 100;

    System.out.println(1 / 2 * mouseX);
    System.out.println(1.0 / 2 * mouseX);
    System.out.println(7 / 2);
    System.out.println(7 / 2.0);
  }
}
