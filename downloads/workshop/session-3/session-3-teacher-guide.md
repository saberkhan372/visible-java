# Teacher guide: Make objects visible

For the 30-minute class-design activity in `session-3-student-handout.md`. Every sketch
behavior below comes from running the sketches in Processing 4.3.4.

## Where it fits

- **AP CS A:** writing classes, with fields, constructors, and methods (Unit 3), references,
  and traversing an array of objects (Unit 4). Free-response Question 2 asks students to
  write a whole class. The plain-Java files in `plain-java/` are the AP-style follow-up.
- **Other courses:** a first look at objects in any language, a particle or ecosystem
  project in creative coding, or a game with many characters.

## Expected answers

**Read the class.**

1. `x`, `y`, `xSpeed`, `ySpeed`, `diameter`.
2. Each call is made on one object, as in `balls[2].move()`. Inside the method, `x` means
   that object's `x`.

**Draw the objects.** There are two `Ball` objects and three variables. `a` and `c` both
point to the first object, and `b` points to the second.

| Object | x | y | xSpeed | ySpeed | diameter | Referred to by |
|---|---|---|---|---|---|---|
| first | 105.0 | 100.0 | 5.0 | 0.0 | 40.0 | `a`, `c` |
| second | 300.0 | 200.0 | -2.0 | 3.0 | 60.0 | `b` |

1. Two objects, three variables. `Ball c = a;` makes a new variable, not a new ball.
2. `a.x` is 105.0. `c` and `a` refer to the same object, so moving it through `c` moves
   it for `a` too. This is the same thing that makes one ball move twice as fast after
   `b = a` in the session.

**Design your own class.** Answers vary. A strong answer for a firefly:

| Field name | Type | What it remembers |
|---|---|---|
| `x` | `float` | Where it is across the window |
| `y` | `float` | Where it is down the window |
| `brightness` | `float` | How bright it is right now |
| `blinkSpeed` | `float` | How fast it brightens and fades |

1. `class Firefly {`
2. `Firefly(float startX, float startY, float startBlinkSpeed) {`. Brightness can start at
   0 for every firefly, so it doesn't need a parameter.
3. `blink()` changes `brightness`. `show()` draws it.

Look for a constructor that takes parameters only for the fields that differ between
objects, and at least one method that changes a field.

**Who is touching?**

```java
boolean touches(Ball other) {
  float distance = dist(x, y, other.x, other.y);
  return distance < (diameter + other.diameter) / 2;
}
```

The sketch `BallTouch` uses this method.

## Likely misconceptions

- **"`Ball c = a;` makes a copy."** It copies the reference. Ask students to count objects
  by counting `new`.
- **"Declaring `Ball a;` makes a ball."** It makes a name that refers to nothing (`null`)
  until `new` runs. Leaving out one `new` line in `BallArrayCheckpoint` stops the sketch
  with a `NullPointerException`.
- **"`new Ball[4]` makes four balls."** It makes four empty slots. Each ball needs its own
  `new`.
- **`x = x;` in a constructor.** When a parameter has the same name as a field, the
  parameter wins, and the field is never set. Use different names, or `this.x = x;`.

## Assessing it

Assess the diagram, not the sketch. A student who draws two objects, three variables, and
two arrows pointing at the first object understands references. For the class design,
look for fields that describe one object, and a constructor that sets them.
