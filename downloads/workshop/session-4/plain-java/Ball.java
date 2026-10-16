// Session 4, Java transfer: the model half of the sketch. No window, no drawing.
// A ball moves inside a world of a given width and height, counts its bounces,
// and stops for good after its third.

public class Ball {
  private double x;
  private double y;
  private double xSpeed;
  private double ySpeed;
  private int bounces;

  public Ball(double startX, double startY, double startXSpeed, double startYSpeed) {
    x = startX;
    y = startY;
    xSpeed = startXSpeed;
    ySpeed = startYSpeed;
    bounces = 0;
  }

  /** Returns true until this ball has bounced three times. */
  public boolean isActive() {
    return bounces < 3;
  }

  /** One frame of motion in a world w wide and h tall. An inactive ball does not move. */
  public void move(int w, int h) {
    if (isActive()) {
      x = x + xSpeed;
      y = y + ySpeed;
      if (x > w - 20 || x < 20) {
        xSpeed = -xSpeed;
        bounces++;
      }
      if (y > h - 20 || y < 20) {
        ySpeed = -ySpeed;
        bounces++;
      }
    }
  }

  public double getX() {
    return x;
  }

  public double getY() {
    return y;
  }

  public int getBounces() {
    return bounces;
  }
}
