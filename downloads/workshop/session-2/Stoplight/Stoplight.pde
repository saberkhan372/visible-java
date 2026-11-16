// A light the car obeys: Visible Java Session 2 mini-lecture
// Click inside the window, then press the space bar to flip the light.
// Predict: where does the car stop on red?

float carX = 0;
boolean lightIsGreen = true;

void setup() {
  size(600, 400);
}

void draw() {
  background(230);

  if (lightIsGreen) {
    fill(0, 190, 80);
  } else {
    fill(220, 40, 40);
  }
  circle(450, 80, 50);

  if (lightIsGreen) {
    carX = carX + 3;
  }
  if (carX > width) {
    carX = 0;
  }

  fill(40, 90, 200);
  rect(carX, 220, 60, 30);
}

void keyPressed() {
  if (key == ' ') {
    lightIsGreen = !lightIsGreen;
  }
}
