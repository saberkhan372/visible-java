// Session 1 concept: which lines run once, and which run again and again?
// Predict the console, then press Run.

int frames = 0;

void setup() {
  size(400, 200);
  println("setup ran");
}

void draw() {
  frames = frames + 1;
  background(255);
  fill(0);
  text(frames, 190, 100);

  if (frames <= 3) {
    println("draw ran: " + frames);
  }
}
