// Traffic light with a walk button: Visible Java Session 3
// TrafficLightFlags plus a walk sign and a person who crosses the street.
// From an idea in Session 2: a button that makes the car stop no matter what.
//
// Click the button on the pole. Green ends at once, then yellow, then red.
// When the car is behind the stop line or past the crosswalk, the sign says WALK
// and the person crosses. Red holds until they reach the other side.
// Once they are across, click again and they cross back.
// (The lights themselves don't take clicks here.)
//
// The six objects never talk to each other directly. Each frame, draw() asks
// them about their flags (booleans) with getters, and passes the signal on
// with setters:
//   a push is waiting, and green is on             -> green ends
//   a push is waiting, red is on, no car in the way -> WALK, and the person starts
//   the sign says WALK, the person is not crossing  -> the sign goes back to WAIT
//   which light is on                               -> the car's speed
//
// Predict: you click the button while the light is green and the car's front
// bumper is just past the stop line. What happens, in order?

final int STOP_LINE = 425;     // the car's front bumper stops here
final int CROSS_RIGHT = 490;   // the crosswalk's right edge

Light red = new Light(510, 55, 230, 40, 40);
Light yellow = new Light(510, 115, 250, 210, 40);
Light green = new Light(510, 175, 60, 200, 80);
Car car = new Car(40, 305);
WalkSign walkSign = new WalkSign(522, 222, 510, 268);
Pedestrian person = new Pedestrian(465, 298, 430);
int counter = 0;

public void settings() {
  size(600, 440);
}

public void setup() {
  green.setOn(true);
}

public void draw() {
  background(185, 220, 250);

  // The light changes every 180 frames, but red holds
  // while someone is waiting to cross or crossing.
  boolean holdRed = red.isOn() && (walkSign.isRequested() || walkSign.isWalk());
  counter = counter + 1;
  if (counter >= 180 && !holdRed) {
    changeLight();
    counter = 0;
  }

  // A push on green ends the green now.
  if (walkSign.isRequested() && green.isOn()) {
    changeLight();
    counter = 0;
  }

  // Red, a push, and no car in the way: WALK.
  boolean carIsClear = car.getFront() <= STOP_LINE || car.getBack() >= CROSS_RIGHT;
  if (red.isOn() && walkSign.isRequested() && carIsClear) {
    walkSign.setRequested(false);
    walkSign.setWalk(true);
    person.startCrossing();
  }

  // The person walks. On the other side, the sign goes back to WAIT.
  person.walk();
  if (walkSign.isWalk() && !person.isCrossing()) {
    walkSign.setWalk(false);
  }

  // Red stops a car that has reached the line. A car already past it keeps going.
  // "Reached" means within 3 pixels, one step, so the car can't jump over the line.
  int front = car.getFront();
  boolean atLine = front >= STOP_LINE - 3 && front <= STOP_LINE;
  if (red.isOn() && atLine) {
    car.setSpeed(0);
  } else if (yellow.isOn()) {
    car.setSpeed(1);
  } else {
    car.setSpeed(3);
  }
  car.move();

  drawStreet();
  person.display();
  car.display();
  drawPole();
  red.display();
  yellow.display();
  green.display();
  walkSign.display();
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

// The button does nothing while the sign already says WALK.
public void mousePressed() {
  if (walkSign.buttonContains(mouseX, mouseY) && !walkSign.isWalk()) {
    walkSign.setRequested(true);
  }
}

public void drawStreet() {
  noStroke();
  fill(175);
  rect(0, 288, 600, 12);        // far sidewalk
  rect(0, 400, 600, 40);        // near sidewalk
  fill(70);
  rect(0, 300, 600, 100);       // road
  fill(255, 210, 0);
  for (int x = 0; x < 600; x += 60) {
    rect(x, 357, 30, 6);
  }
  fill(245);
  for (int y = 304; y < 400; y += 16) {
    rect(440, y, 50, 8);        // crosswalk
  }
  rect(427, 300, 4, 100);       // stop line
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

  public boolean isOn() {
    return on;
  }

  public void setOn(boolean on) {
    this.on = on;
  }

  public void display() {
    stroke(0);
    if (on) {
      fill(r, g, b);
    } else {
      fill(r / 3, g / 3, b / 3);
    }
    ellipse(x, y, 50, 50);
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

  // The car is 120 long. x is its back bumper.
  public int getFront() {
    return x + 120;
  }

  public int getBack() {
    return x;
  }

  public void setSpeed(int speed) {
    this.speed = speed;
  }

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

class WalkSign {
  private int boxX;
  private int boxY;
  private int buttonX;
  private int buttonY;
  private boolean walk;        // what the sign shows: WALK or WAIT
  private boolean requested;   // someone pushed the button and is waiting

  public WalkSign(int boxX, int boxY, int buttonX, int buttonY) {
    this.boxX = boxX;
    this.boxY = boxY;
    this.buttonX = buttonX;
    this.buttonY = buttonY;
    walk = false;
    requested = false;
  }

  public boolean isWalk() {
    return walk;
  }

  public void setWalk(boolean walk) {
    this.walk = walk;
  }

  public boolean isRequested() {
    return requested;
  }

  public void setRequested(boolean requested) {
    this.requested = requested;
  }

  // The button is 24 across, so a click within 12 of its center is on it.
  public boolean buttonContains(int mx, int my) {
    double distance = Math.sqrt(Math.pow(buttonX - mx, 2) + Math.pow(buttonY - my, 2));
    return distance <= 12;
  }

  public void display() {
    stroke(0);
    fill(30);
    rect(boxX, boxY, 66, 34, 6);
    textAlign(CENTER, CENTER);
    textSize(16);
    if (walk) {
      fill(245);
      text("WALK", boxX + 33, boxY + 16);
    } else {
      fill(255, 140, 0);
      text("WAIT", boxX + 33, boxY + 16);
    }

    // The button lights up while a push is waiting.
    if (requested) {
      fill(255, 220, 0);
    } else {
      fill(150);
    }
    ellipse(buttonX, buttonY, 24, 24);
  }
}

class Pedestrian {
  private int x;
  private int y;            // where the feet are
  private int topY;         // the far curb
  private int bottomY;      // the near curb
  private int direction;    // 1 walks down the screen, -1 walks back up
  private boolean crossing;

  public Pedestrian(int x, int topY, int bottomY) {
    this.x = x;
    this.topY = topY;
    this.bottomY = bottomY;
    y = topY;
    direction = 1;
    crossing = false;
  }

  public boolean isCrossing() {
    return crossing;
  }

  public void startCrossing() {
    crossing = true;
  }

  // One pixel a frame while crossing. At the other curb, stop and turn around.
  public void walk() {
    if (crossing) {
      y = y + direction;
      if (y == topY || y == bottomY) {
        crossing = false;
        direction = -direction;
      }
    }
  }

  public void display() {
    // Legs swing while crossing.
    int swing = 0;
    if (crossing && y % 20 < 10) {
      swing = 4;
    }
    stroke(0);
    strokeWeight(3);
    line(x - 3, y - 14, x - 3 - swing, y);
    line(x + 3, y - 14, x + 3 + swing, y);
    strokeWeight(1);
    fill(240, 120, 60);
    rect(x - 8, y - 34, 16, 22, 4);   // body
    fill(235, 195, 160);
    ellipse(x, y - 42, 16, 16);       // head
  }
}
