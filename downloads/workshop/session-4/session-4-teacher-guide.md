# Teacher guide: Make learning transferable

For the one-period lesson in `session-4-student-handout.md`. Every output below comes from
running the sketches in Processing 4.3.4 and the Java files with Java 17. This guide is the
rest of the lesson package: evidence to expect, assessment criteria, likely
misconceptions, and an implementation plan to fill in.

## Where it fits

- **AP CS A:** writing methods, traversing an `ArrayList`, and the standard count
  algorithm (Units 3 and 4). Free-response Question 3 asks for a method like
  `countActive()`. Explaining why code is correct is the written reasoning the course asks
  for.
- **Other courses:** a unit on testing, a science simulation where the model matters more
  than the picture, or any project course where the logic should outlive the graphics.

## Expected evidence

**Run and predict.** The diagonal ball, which starts at (300, 300), stops first, about a
second and a half in. It hits a floor and a wall, and every hit counts. Most students pick
the fastest-looking ball. The ball moving only sideways stops last.

**Separate the model from the view.** After each change, the picture is identical. In the
finished `Ball` class there is no `fill`, `circle`, `width`, or `height`. The sketch
`ModelViewCheckpoint` is the finished version.

**Ask the collection a question.**

```java
int countActive() {
  int count = 0;
  for (Ball b : balls) {
    if (b.isActive()) {
      count = count + 1;
    }
  }
  return count;
}
```

The corner reads 4, 3, 2, 1, 0. The last ball stops about four and a half seconds in.

**Test the model.** All ten tests print PASS. The two that students most often predict
wrong are "a corner hit counts twice" (one move can add two bounces) and "after 100 frames,
bounces" (exactly 3, the boundary).

**Explain.** Strong answers:

1. The model is the state and the rules: positions, speeds, bounces, and when a ball stops.
   The view is how that state is drawn. The model can run with no view at all.
2. If the rule changes, it changes in one place. When the same condition is written three
   times, one copy gets edited and the others don't. That bug shows the right count with
   the wrong picture.
3. Any case that sits on a boundary or an edge: an empty list, every ball stopped, two
   stopped balls side by side (which catches a forward-looping remove), or a ball with
   exactly two bounces.

## Assessment criteria

| Criterion | Not yet | Developing | Secure |
|---|---|---|---|
| **Separates model from view** | Drawing code is still inside `Ball`. | `Ball` doesn't draw, but still reads `width` or `height`. | `Ball` uses nothing from Processing. The picture is unchanged. |
| **Writes the query** | No loop, or the count isn't returned. | Loops and counts, but repeats `bounces < 3` instead of calling `isActive()`. | Starts at 0, visits every ball, calls `isActive()`, returns the count. |
| **Reasons about tests** | No predictions, or the predictions were changed after running. | Predictions made, wrong ones not explained. | Wrong predictions circled and explained. Names a new test case and what it would catch. |
| **Explains in writing** | Restates the code. | Correct but vague ("it's cleaner"). | Says what would go wrong without the change, with an example. |

Weight the last two rows most. A working sketch can hide a student who copied it. The
predictions and explanations can't.

## Likely misconceptions

- **"The fastest ball stops first."** Stopping depends on bounces, not speed. Ask students
  to count wall hits, not pixels.
- **"Taking out `show()` breaks the program."** The console in `ActiveTrace` keeps
  printing the same lines with no drawing at all. Show that before the build.
- **Removing inside `for (Ball b : balls)`.** Java stops with a
  `ConcurrentModificationException`. To remove, loop backward with an index.
- **"All the tests pass, so it's right."** The tests only check the cases someone thought
  of. A forward-looping `removeInactive()` passes every test except the side-by-side one.

## Implementation plan

Fill this in for one class you teach. Bring it to Session 5.

| Question | Your answer |
|---|---|
| Course and grade level | |
| Where in the course this lands (unit, week) | |
| What students must already know | |
| How you will split the time (one period, or two) | |
| What you will cut or add for your students | |
| How students will hand in evidence | |
| Which criterion you will grade, and how | |
| Accommodations, or a lighter version for students who need one | |
| What you will listen for while students work | |
| One thing you will change after teaching it once | |
