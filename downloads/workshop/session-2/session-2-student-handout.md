# Make decisions visible: a debugging lab

**Time:** 30 minutes. **You need:** Processing, and the sketches `WallBallCheckpoint` and `BrokenBall`.

A program makes a **decision** with an `if` and a **condition**: a question that is either
true or false. When a decision is wrong, the picture usually shows you. In this lab you
find three bugs by watching what a sketch does.

## 1. See how it should work (5 minutes)

Open `WallBallCheckpoint` and press Run. Press `p` a few times. Click inside the window
first if keys do nothing.

Write one sentence: what three things does this sketch do?

> ______________________________________________

## 2. Find the bugs (20 minutes)

Open `BrokenBall`. It is supposed to behave exactly like `WallBallCheckpoint`, but it has
three bugs. **Don't compare the code line by line.** Run it, watch, and fill in one row for
each bug you find.

| What you saw | The line with the bug | What should it say? |
|---|---|---|
| | | |
| | | |
| | | |

Hints, if you need them:

- **Bug 1:** Watch where the ball goes. Which `if` should have stopped it? Pick a value of
  `x` that should make that condition true. Is it true?
- **Bug 2:** Count the cells along the bottom. Then count how many times the loop runs.
- **Bug 3:** Tap `p` quickly five times. Does it pause every time? Find where the sketch
  reads the key, and compare it with how `WallBallCheckpoint` does it.

Fix one bug at a time, and run the sketch after each fix.

## 3. Explain (5 minutes)

Answer in full sentences.

1. For bug 1, name a value of `x` that should have turned the ball around. Explain why the
   broken condition was false for it.
2. For bug 2, how many times did the broken loop run, and how many should it run?
3. `keyPressed()` and `keyPressed` (no parentheses) are different. In your own words, what
   is the difference?
4. A ball that starts at `x = 390` shivers in place. Is that a bug in the condition or in
   the starting value? Explain.
