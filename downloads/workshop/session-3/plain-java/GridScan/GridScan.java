// Session 3, optional bridge: the BallGrid sketch as a 2D array method.
// AP free-response Question 4 asks for one method over a 2D array. No window here.
// Predict the count and the row-by-row output before you run it.

public class GridScan {

  /** Returns the number of balls in grid that are moving. */
  public static int countMoving(Ball[][] grid) {
    int count = 0;
    for (int row = 0; row < grid.length; row++) {
      for (int col = 0; col < grid[0].length; col++) {
        if (grid[row][col].isMoving()) {
          count++;
        }
      }
    }
    return count;
  }

  /** Returns the number of moving balls in the given row. */
  public static int countMovingInRow(Ball[][] grid, int row) {
    int count = 0;
    for (Ball b : grid[row]) {
      if (b.isMoving()) {
        count++;
      }
    }
    return count;
  }

  public static void main(String[] args) {
    Ball[][] grid = new Ball[3][3];
    for (int row = 0; row < grid.length; row++) {
      for (int col = 0; col < grid[0].length; col++) {
        grid[row][col] = new Ball(col - 1, row - 1);
      }
    }

    System.out.println(countMoving(grid));
    for (int row = 0; row < grid.length; row++) {
      System.out.println("row " + row + ": " + countMovingInRow(grid, row));
    }
  }
}

class Ball {
  private double xSpeed;
  private double ySpeed;

  public Ball(double xSpeed, double ySpeed) {
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }

  public boolean isMoving() {
    return xSpeed != 0 || ySpeed != 0;
  }
}
