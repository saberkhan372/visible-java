// Visible lab 3: Data bars.
// The file holds made-up monthly rainfall. Scanner reads it one line at a time.
// Click to reveal one more line. Before you click, predict the next bar's height.

import java.util.Scanner;

ArrayList<String> lines = new ArrayList<String>();
int shown = 1;

void setup() {
  size(560, 340);
  textSize(16);

  // Processing needs try and catch here. The AP-style version says throws IOException.
  try {
    Scanner input = new Scanner(new File(dataPath("rainfall.txt")));
    while (input.hasNext()) {
      lines.add(input.nextLine());
    }
    input.close();
  } catch (IOException e) {
    println("Could not read the file: " + e);
    exit();
  }
}

void draw() {
  background(255);

  for (int i = 0; i < shown; i++) {
    String[] parts = lines.get(i).split(",");
    double inches = Double.parseDouble(parts[1]);
    float barHeight = (float) inches * 40;

    fill(120, 170, 230);
    rect(40 + i * 80, 240 - barHeight, 60, barHeight);
    fill(0);
    text(parts[0], 55 + i * 80, 262);
  }

  fill(0);
  text("Line " + (shown - 1) + ": \"" + lines.get(shown - 1) + "\"", 40, 300);
  text("Click to read the next line", 40, 325);
}

void mousePressed() {
  shown = shown + 1;
  if (shown > lines.size()) {
    shown = 1;
  }
  println(lines.get(shown - 1));
}
