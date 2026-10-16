# Make objects visible: design a class

**Time:** 30 minutes. **You need:** Processing, and the sketch `BallArrayCheckpoint`.

A **class** is a plan for a kind of thing. An **object** is one thing made from that plan
with `new`. Each object keeps its own **fields**: the variables that describe it. In this
activity you read a class, draw what its objects look like in memory, and design a class
of your own.

## 1. Read the class (5 minutes)

Open `BallArrayCheckpoint` and press Run.

1. List the five fields every `Ball` has.

> ______________________________________________

2. There are four balls but only one `move()` method. How does `move()` know which ball
   to move?

> ______________________________________________

## 2. Draw the objects (10 minutes)

Read this code. Then draw an **object-state diagram**: a box for each variable, an arrow
from each variable to the object it refers to, and each object as a box listing its
fields and their values. Draw the picture **after the last line runs**.

```java
Ball a = new Ball(100, 100, 5, 0, 40);
Ball b = new Ball(300, 200, -2, 3, 60);
Ball c = a;
c.move();
```

> (your diagram)

1. How many `Ball` objects exist? How many variables?
2. What is `a.x` after the last line? Explain why it changed even though the last line
   never mentions `a`.

## 3. Design your own class (10 minutes)

Choose a new kind of object for a sketch: a firefly that blinks, a car that changes lanes,
a plant that grows, or your own idea. Fill in the table.

| Field name | Type | What it remembers |
|---|---|---|
| | | |
| | | |
| | | |

Now write:

1. The first line of the class: `class ________ {`
2. The constructor's first line, with one parameter for each field that should start out
   different from object to object.
3. The names of two methods: one that **changes** a field each frame, and one that
   **draws** the object.

## 4. Want more? Who is touching? (5 minutes)

Two balls touch when the distance between their centers is less than the sum of their
radii. Fill in the blanks.

```java
boolean touches(Ball other) {
  float distance = dist(x, y, ________, ________);
  return distance < ____________________;
}
```
