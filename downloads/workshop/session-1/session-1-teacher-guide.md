# Teacher guide: Make state visible

For the 30-minute student activity in `session-1-student-handout.md`. Every answer below
comes from running the sketches in Processing 4.3.4.

## Where it fits

- **AP CS A:** variables, assignment, expressions, and tracing values through repeated
  execution (Unit 1). The plain-Java files in `plain-java/` are the AP-style follow-up.
- **Other courses:** an intro to programming, a creative coding class, or a physics
  lesson on motion. The prediction table works without any AP framing.

## Expected answers

**Run it.** The ball slides straight down from the top center and leaves the bottom in
about three and a half seconds. It starts half hidden, because its center is on the top edge.

**Prediction table.**

| Frame | Drew at y | y after the frame |
|---|---|---|
| 1 | 0.0 | 2.0 |
| 2 | 2.0 | 4.0 |
| 3 | 4.0 | 6.0 |
| 4 | 6.0 | 8.0 |
| 5 | 8.0 | 10.0 |

The console prints `0.0`, not `0`, because `y` is a `float`.

**Change one thing.**

1. It moves 2.5 times as fast and leaves in under a second and a half.
2. Nothing visible changes. The speed now has a name, so the program could change it.
3. Diagonally down and to the right. It leaves through the bottom about three-quarters of
   the way across.
4. A trail: every frame stays on screen, so you see the whole path at once.
5. It starts slowly and speeds up. With `xSpeed` too, the path curves like a thrown ball.

**Explain.**

1. `y` (and `x`, `ySpeed`, `xSpeed` if added).
2. Processing calls `draw()` about 60 times a second. The student never calls it.
3. A variable declared inside `draw()` is created again, set to 0, every time `draw()` runs,
   and thrown away when it ends. State that must last between frames lives outside `draw()`.

## Likely misconceptions

- **"Frame 5 draws at 10."** The most common error. The circle is drawn *before* `y` changes.
  Ask students to point to the line that draws, then the line that changes `y`.
- **"`draw()` runs once."** Slow it down with `frameRate(1)` and watch the console.
- **"The ball moves because of `circle`."** `circle` only draws where it is told. The motion
  is the variable changing.
- **Students delete `background` and think the program broke.** Nothing broke. That is the
  point of question 4.

## Assessing it

Assess the reasoning, not the visual polish. Evidence of understanding: a prediction table
with errors corrected and explained, and a correct answer to Explain question 3.
