// Traffic light with flags: Visible Java Session 3
// Session 2's TrafficLightTimer, rebuilt from objects.
// Each Light keeps its own flag, a boolean that says whether it is on.
// The Car keeps its own position and speed.
// The fields are private. Other code asks a light with a getter, isOn(),
// and tells it something with a setter, setOn(). That is how AP CS A writes classes.
//
// Predict: this runs like TrafficLightTimer. Green, yellow, red every 180 frames,
// and a click on a light still changes it. Where does the sketch ask a light
// a question? Where does it tell the car something?

Light red = new Light(510, 55, 230, 40, 40);
Light yellow = new Light(510, 115, 250, 210, 40);
Light green = new Light(510, 175, 60, 200, 80);
Car car = new Car(40, 305);
int counter = 0;

public void settings() {
  size(600, 400);
}

public void setup() {
  green.setOn(true);
}

public void draw() {
  background(185, 220, 250);

  counter = counter + 1;
  if (counter >= 180) {
    changeLight();
    counter = 0;
  }

  // The lights pass their signal to the car.
  if (green.isOn()) {
    car.setSpeed(3);
  } else if (yellow.isOn()) {
    car.setSpeed(1);
  } else {
    car.setSpeed(0);
  }
  car.move();

  drawRoad();
  drawPole();
  red.display();
  yellow.display();
  green.display();
  car.display();
}

public void changeLight() {
  if (green.isOn()) {
    turnOn(yellow);
  } else if (yellow.isOn()) {
    turnOn(red);
  } else {
    turnOn(green);
  }
}

// One light on, the other two off. Whichever light is passed in ends up on.
public void turnOn(Light light) {
  red.setOn(false);
  yellow.setOn(false);
  green.setOn(false);
  light.setOn(true);
}

public void mousePressed() {
  if (red.contains(mouseX, mouseY)) {
    turnOn(red);
  } else if (yellow.contains(mouseX, mouseY)) {
    turnOn(yellow);
  } else if (green.contains(mouseX, mouseY)) {
    turnOn(green);
  }
  counter = 0;
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

class Light {
  private int x;
  private int y;
  private int r;
  private int g;
  private int b;
  private boolean on;

  public Light(int x, int y, int r, int g, int b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    on = false;
  }

  // Getter: a boolean getter is named isSomething instead of getSomething.
  public boolean isOn() {
    return on;
  }

  // Setter
  public void setOn(boolean on) {
    this.on = on;
  }

  // Full color when on. A third of each part when off, so the light looks dark.
  public void display() {
    stroke(0);
    if (on) {
      fill(r, g, b);
    } else {
      fill(r / 3, g / 3, b / 3);
    }
    ellipse(x, y, 50, 50);
  }

  // The distance check from Session 2, now asked of one light.
  public boolean contains(int mx, int my) {
    double distance = Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2));
    return distance <= 25;
  }
}

class Car {
  private int x;
  private int y;
  private int speed;

  public Car(int x, int y) {
    this.x = x;
    this.y = y;
    speed = 0;
  }

  public void setSpeed(int speed) {
    this.speed = speed;
  }

  // Always add the speed. Once the whole car is off the right edge,
  // bring it back in from the left.
  public void move() {
    x = x + speed;
    if (x > width) {
      x = -120;
    }
  }

  public void display() {
    stroke(0);
    fill(30, 90, 200);
    rect(x + 25, y - 25, 65, 30, 8);   // roof
    rect(x, y, 120, 35, 8);            // body
    fill(20);
    ellipse(x + 25, y + 35, 28, 28);   // back wheel
    ellipse(x + 95, y + 35, 28, 28);   // front wheel
  }
}
