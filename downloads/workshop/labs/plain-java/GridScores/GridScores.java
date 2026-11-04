// Visible lab 2, Java transfer: the grid totals with no window.
// The two methods are the same ones the sketch uses. Predict every line before you run it.

public class GridScores {

  /** Returns the sum of the values in the given row. */
  public static int rowTotal(int[][] grid, int row) {
    int total = 0;
    for (int col = 0; col < grid[0].length; col++) {
      total = total + grid[row][col];
    }
    return total;
  }

  /** Returns the sum of the values in the given column. */
  public static int colTotal(int[][] grid, int col) {
    int total = 0;
    for (int row = 0; row < grid.length; row++) {
      total = total + grid[row][col];
    }
    return total;
  }

  public static void main(String[] args) {
    int[][] tiles = {
      {1, 0, 0, 1, 0, 0},
      {0, 1, 0, 0, 1, 0},
      {1, 1, 1, 0, 0, 0},
      {0, 0, 1, 0, 1, 1}
    };

    System.out.println(rowTotal(tiles, 2));
    System.out.println(colTotal(tiles, 2));

    tiles[2][2] = 0;
    System.out.println(rowTotal(tiles, 2));
    System.out.println(colTotal(tiles, 2));
  }
}
