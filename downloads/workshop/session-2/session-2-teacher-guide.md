# Teacher guide: Make decisions visible

For the 30-minute debugging lab in `session-2-student-handout.md`. Every answer below comes
from running the sketches in Processing 4.3.4.

## Where it fits

- **AP CS A:** Boolean expressions, `if` statements, and iteration (Unit 2). The plain-Java
  files in `plain-java/` are the AP-style follow-up: the same conditions with no window.
- **Other courses:** a first lesson on conditionals, a game-design unit, or any course that
  teaches debugging as a skill. Nothing in the lab needs AP vocabulary.

## Expected answers

**See how it should work.** The ball bounces off all four walls, `p` pauses and unpauses it,
and the cell in the bottom row under the ball is black.

**Find the bugs.** Students can find them in any order, but bug 1 sends the ball off the
screen after about four seconds, so most find it first.

| What you saw | The line with the bug | What it should say |
|---|---|---|
| The ball leaves through the right side. | `if (x > width - 20 && x < 20)` | `if (x > width - 20 \|\| x < 20)` |
| The bottom row has nine cells, and nothing lights up at the right end. | `for (int i = 0; i < 9; i++)` | `for (int i = 0; i < 10; i++)` |
| `p` pauses only some of the time. | `if (keyPressed && key == 'p')` inside `draw()` | Delete it, and add `void keyPressed() { if (key == 'p') { paused = !paused; } }` |

**Explain.**

1. Any `x` above 380, such as 390. The broken condition asks whether `x` is above 380
   *and* below 20 at the same time. No number is both, so the condition is never true.
2. The broken loop ran 9 times (`i` = 0 to 8). It should run 10 times, one for each
   40-pixel cell across a 400-pixel window.
3. `keyPressed()` is a method Processing calls once each time a key goes down: an event.
   `keyPressed` is a variable that stays true for as long as a key is held: a state.
   A quick tap still lasts several frames, so code that reads the variable in `draw()`
   flips `paused` several times. An even number of flips leaves it unchanged.
4. The starting value. The rule is correct, but the ball starts past the wall. One step
   back still leaves it past the wall, so the condition is true again and the speed flips
   back on every frame.

## Likely misconceptions

- **"The wall stops the ball."** It doesn't. The ball moves past 380 first, and then the
  `if` reverses the speed. `WallTrace` shows it at 395 on frame 3.
- **"`&&` and `||` mean what they mean in English."** "Turn around if it's past the left
  or the right" is `||`. Ask students to name one value that makes each condition true.
- **"The loop runs `i < 9` times, so 9 cells, and that's close enough."** The visible gap is
  the point. Off-by-one errors are much easier to see than to read.
- **"The bug is wherever I changed things last."** Have students state a symptom before
  they touch code.

## Assessing it

Assess the explanations, not the fixed sketch. A student who can name a value that makes a
condition wrongly true or false has understood it. A student who changed numbers until it
worked has not, even if the sketch now runs. Question 1 and question 4 are the strongest
evidence.
