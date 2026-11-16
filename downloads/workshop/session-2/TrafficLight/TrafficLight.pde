// Traffic light starter: Visible Java Session 2
// Rebuilt from the recording of Joshua Hans's Pickcode lesson "visible java traffic".
// The Pickcode lesson is the original. This copy runs in the Processing editor.
//
// Predict: What will you see? What happens when you click each light?
// Run: Click all three lights. Were you right?
// Investigate: Find the code that checks a click on the red light.
//              Why can't you get back to green?
// Modify: Make yellow and green clickable.
// Make: Drive on green, slow on yellow, stop on red.
// Bonus: Wrap the car around the screen.

String state = "green";
float carX = 40;

public void settings() {
  size(600, 400);
}

public void draw() {
  background(185, 220, 250);
  drawRoad();
  drawLight();
  drawCar(carX, 305);
}

public void drawRoad() {
  noStroke();
  fill(70);
  rect(0, 300, 600, 100);
  fill(255, 210, 0);
  for (int x = 0; x < 600; x += 60) {
    rect(x, 357, 30, 6);
  }
}

public void drawLight() {
  stroke(0);
  fill(60);
  rect(505, 210, 10, 90);       // pole
  rect(475, 20, 70, 190, 10);   // box

  // red
  if (state.equals("red")) {
    fill(230, 40, 40);
  } else {
    fill(90, 30, 30);
  }
  ellipse(510, 55, 50, 50);

  // yellow
  if (state.equals("yellow")) {
    fill(250, 210, 40);
  } else {
    fill(90, 80, 20);
  }
  ellipse(510, 115, 50, 50);

  // green
  if (state.equals("green")) {
    fill(60, 200, 80);
  } else {
    fill(25, 75, 35);
  }
  ellipse(510, 175, 50, 50);
}

public void drawCar(float x, float y) {
  stroke(0);
  fill(30, 90, 200);
  rect(x + 25, y - 25, 65, 30, 8);   // roof
  rect(x, y, 120, 35, 8);            // body
  fill(20);
  ellipse(x + 25, y + 35, 28, 28);   // back wheel
  ellipse(x + 95, y + 35, 28, 28);   // front wheel
}

public void mousePressed() {
  double d = calculateDistance(mouseX, mouseY, 510, 55);
  if (d <= 25) {
    state = "red";
  }
}

public double calculateDistance(int x1, int y1, int x2, int y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
