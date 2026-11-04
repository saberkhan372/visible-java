// Visible lab 1: String tiles.
// Click to slide the window along the word. The sketch checks one window at a time.
// Before you click, predict: where will the first match be? How many will there be?

String word = "banana";
String target = "ana";
int start = 0;
int cell = 80;

void setup() {
  size(640, 300);
  textAlign(CENTER, CENTER);
  report();
}

void draw() {
  background(255);
  String window = word.substring(start, start + target.length());

  for (int i = 0; i < word.length(); i++) {
    int x = 40 + i * cell;

    if (i >= start && i < start + target.length()) {
      if (window.equals(target)) {
        fill(170, 230, 190);
      } else {
        fill(255, 225, 130);
      }
    } else {
      fill(240);
    }
    rect(x, 50, cell, cell);

    fill(0);
    textSize(36);
    text(word.substring(i, i + 1), x + cell / 2, 88);
    textSize(14);
    text(i, x + cell / 2, 145);
  }

  fill(0);
  textSize(18);
  text("word.substring(" + start + ", " + (start + target.length()) + ") is \"" + window + "\"", width / 2, 195);
  text("word.indexOf(\"" + target + "\") is " + word.indexOf(target), width / 2, 225);
  text("Click to move the window", width / 2, 260);
}

void mousePressed() {
  start = start + 1;
  if (start > word.length() - target.length()) {
    start = 0;
  }
  report();
}

void report() {
  String window = word.substring(start, start + target.length());
  println(start + ": " + window + " " + window.equals(target));
}
