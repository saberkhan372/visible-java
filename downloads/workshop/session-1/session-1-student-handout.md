# Make state visible: a moving ball

**Time:** 30 minutes. **You need:** Processing, and the sketch `MovingBall`.

A program remembers things in **variables**. What a program remembers right now is its
**state**. In this activity you watch state change, one frame at a time.

## 1. Run it (5 minutes)

Open `MovingBall` and press Run.

Write one sentence: what does the ball do?

> ______________________________________________

## 2. Predict, then check (10 minutes)

Open `FrameByFrame`. It is the same ball, slowed to one frame per second.
**Fill in the "Predicted" column before you press Run.**

| Frame | Predicted: drew at y | Actual: drew at y | y after the frame |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

Now run it and fill in "Actual". Circle any prediction you got wrong.

## 3. Change one thing (10 minutes)

Before each run, say what you expect. Then run it.

**Everyone:**

1. Change `y = y + 2;` to `y = y + 5;`. What changed?
2. Add a variable `float ySpeed = 2;` and use `y = y + ySpeed;`. What changed?
3. Add `float x = 0;` and `float xSpeed = 1.5;`. Draw with `circle(x, y, 40);` and add
   `x = x + xSpeed;`. Which way does the ball move now?

**Want more?**

4. Delete the line `background(255);`. What do you see, and why?
5. Add `ySpeed = ySpeed + 0.2;` at the end of `draw()`. Describe the new motion.

## 4. Explain (5 minutes)

Answer in full sentences.

1. Which variables are this program's state?
2. `draw()` runs over and over. Who calls it?
3. Why does the ball stop moving if `float y = 0;` is moved inside `draw()`?
