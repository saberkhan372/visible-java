// Visible lab 2: Grid totals.
// Click a tile to turn it on or off. The totals are computed by methods, not counted by eye.
// Before you click, predict: which index changes, and which two totals change with it?

int[][] tiles = {
  {1, 0, 0, 1, 0, 0},
  {0, 1, 0, 0, 1, 0},
  {1, 1, 1, 0, 0, 0},
  {0, 0, 1, 0, 1, 1}
};
int cell = 70;

void setup() {
  size(500, 360);
  textAlign(CENTER, CENTER);
  textSize(18);
}

void draw() {
  background(255);

  for (int row = 0; row < tiles.length; row++) {
    for (int col = 0; col < tiles[0].length; col++) {
      if (tiles[row][col] == 1) {
        fill(120, 170, 230);
      } else {
        fill(240);
      }
      rect(col * cell, row * cell, cell, cell);
      fill(0);
      text(tiles[row][col], col * cell + cell / 2, row * cell + cell / 2);
    }
  }

  fill(0);
  for (int row = 0; row < tiles.length; row++) {
    text(rowTotal(tiles, row), tiles[0].length * cell + 40, row * cell + cell / 2);
  }
  for (int col = 0; col < tiles[0].length; col++) {
    text(colTotal(tiles, col), col * cell + cell / 2, tiles.length * cell + 40);
  }
}

void mousePressed() {
  int row = mouseY / cell;
  int col = mouseX / cell;

  if (row < tiles.length && col < tiles[0].length) {
    tiles[row][col] = 1 - tiles[row][col];
    println("tiles[" + row + "][" + col + "] is now " + tiles[row][col]);
    println("row total " + rowTotal(tiles, row) + ", column total " + colTotal(tiles, col));
  }
}

int rowTotal(int[][] grid, int row) {
  int total = 0;
  for (int col = 0; col < grid[0].length; col++) {
    total = total + grid[row][col];
  }
  return total;
}

int colTotal(int[][] grid, int col) {
  int total = 0;
  for (int row = 0; row < grid.length; row++) {
    total = total + grid[row][col];
  }
  return total;
}
