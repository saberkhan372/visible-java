// Traffic light on a timer: Visible Java Session 2
// The checkpoint, plus a counter that changes the light by itself.
// Green, then yellow, then red, then green again, every 180 frames
// (about three seconds). Clicking a light still works, and restarts the count.

String state = "green";
float carX = 40;
float carSpeed = 3;
int counter = 0;

public void settings() {
  size(600, 400);
}

public void draw() {
  background(185, 220, 250);

  // Your own counter. frameCount can't be set back to 0, so count yourself.
  counter = counter + 1;
  if (counter >= 180) {
    changeLight();
    counter = 0;
  }
  // The shorter version, once modulo makes sense:
  // if (frameCount % 180 == 0) { changeLight(); }

  // The light decides the speed. The car always adds its speed.
  if (state.equals("green")) {
    carSpeed = 3;
  } else if (state.equals("yellow")) {
    carSpeed = 1;
  } else {
    carSpeed = 0;
  }
  carX = carX + carSpeed;

  // Wraparound: once the whole car is off the right edge,
  // bring it back in from the left.
  if (carX > width) {
    carX = -120;
  }

  drawRoad();
  drawLight();
  drawCar(carX, 305);
}

public void changeLight() {
  if (state.equals("green")) {
    state = "yellow";
  } else if (state.equals("yellow")) {
    state = "red";
  } else {
    state = "green";
  }
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
  double redDistance = calculateDistance(mouseX, mouseY, 510, 55);
  double yellowDistance = calculateDistance(mouseX, mouseY, 510, 115);
  double greenDistance = calculateDistance(mouseX, mouseY, 510, 175);

  // Each light is 50 across, so a click within 25 of its center is inside it.
  if (redDistance <= 25) {
    state = "red";
  } else if (yellowDistance <= 25) {
    state = "yellow";
  } else if (greenDistance <= 25) {
    state = "green";
  }
  counter = 0;
}

public double calculateDistance(int x1, int y1, int x2, int y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
