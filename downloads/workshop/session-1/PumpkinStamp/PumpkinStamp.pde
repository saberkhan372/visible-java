// Session 1 guided practice: a pumpkin stamp.
// Press p to stamp a pumpkin at the mouse. drawPumpkin is a method with arguments.
// Add your own method, and a key that calls it.

void setup() {
  size(600, 400);
  background(40, 50, 70);
}

void draw() {
  // draw() stays empty so every stamp stays on the screen.
}

void keyPressed() {
  if (key == 'p') {
    drawPumpkin(mouseX, mouseY, 80);
  }
}

void drawPumpkin(float x, float y, float size) {
  noStroke();

  fill(70, 120, 60);
  rect(x - size / 12, y - size * 0.65, size / 6, size / 4);

  fill(240, 130, 40);
  ellipse(x - size / 3, y, size / 2, size);
  ellipse(x + size / 3, y, size / 2, size);
  ellipse(x, y, size / 2, size);
}
