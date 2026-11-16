// Two shapes, two speeds: Visible Java Session 2 mini-lecture
// Predict: what happens to the car at the right edge? To the bus?

float carX = 0;
float busX = 0;

void setup() {
  size(600, 400);
}

void draw() {
  background(230);

  fill(40, 90, 200);
  rect(carX, 120, 60, 30);
  carX = carX + 3;

  fill(240, 180, 0);
  rect(busX, 240, 100, 40);
  busX = busX + 1;

  if (carX > width) {
    carX = 0;
  }
}
