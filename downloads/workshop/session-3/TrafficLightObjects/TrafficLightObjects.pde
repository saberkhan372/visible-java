// Each light as an object: Visible Java Session 3 opener
// Starts from Session 2's traffic light checkpoint.
// The three lights were three copies of the same code with different numbers:
// a center, a bright color, and a dull color. Now each light is one Light object,
// and the Light class is written once.
//
// Predict: the sketch below draws the same picture as Session 2's checkpoint.
// Which lines from Session 2 disappeared? Where did they go?

String state = "green";
float carX = 40;
float carSpeed = 3;

Light red = new Light("red", 510, 55, 230, 40, 40, 90, 30, 30);
Light yellow = new Light("yellow", 510, 115, 250, 210, 40, 90, 80, 20);
Light green = new Light("green", 510, 175, 60, 200, 80, 25, 75, 35);

public void settings() {
  size(600, 400);
}

public void draw() {
  background(185, 220, 250);

  if (state.equals("green")) {
    carSpeed = 3;
  } else if (state.equals("yellow")) {
    carSpeed = 1;
  } else {
    carSpeed = 0;
  }
  carX = carX + carSpeed;
  if (carX > width) {
    carX = -120;
  }

  drawRoad();
  drawPole();
  red.display(state);
  yellow.display(state);
  green.display(state);
  drawCar(carX, 305);
}

public void mousePressed() {
  if (red.contains(mouseX, mouseY)) {
    state = "red";
  } else if (yellow.contains(mouseX, mouseY)) {
    state = "yellow";
  } else if (green.contains(mouseX, mouseY)) {
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

public void drawPole() {
  stroke(0);
  fill(60);
  rect(505, 210, 10, 90);       // pole
  rect(475, 20, 70, 190, 10);   // box
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

class Light {
  String name;
  int x;
  int y;
  int onRed, onGreen, onBlue;
  int offRed, offGreen, offBlue;

  Light(String name, int x, int y,
        int onRed, int onGreen, int onBlue,
        int offRed, int offGreen, int offBlue) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.onRed = onRed;
    this.onGreen = onGreen;
    this.onBlue = onBlue;
    this.offRed = offRed;
    this.offGreen = offGreen;
    this.offBlue = offBlue;
  }

  // Bright if the sketch's state names this light, dull otherwise.
  void display(String state) {
    stroke(0);
    if (state.equals(name)) {
      fill(onRed, onGreen, onBlue);
    } else {
      fill(offRed, offGreen, offBlue);
    }
    ellipse(x, y, 50, 50);
  }

  // The distance check from Session 2, now asked of one light.
  boolean contains(int mx, int my) {
    double distance = Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2));
    return distance <= 25;
  }
}
