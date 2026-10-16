# Make learning transferable: a model you can test

**Time:** one 50-minute class. **You need:** Processing, Java, the sketch `ActiveBalls`, and
the files in `plain-java/`.

A sketch has two jobs: deciding what happens (the **model**) and drawing it (the **view**).
When the two are mixed together, the behavior only runs inside Processing. When they are
separate, the same model runs anywhere, and you can **test** it: check its answers against
answers you worked out first.

## 1. Run and predict (10 minutes)

Open `ActiveBalls`. **Before you press Run**, answer:

1. Each ball stops on its third bounce. Which ball do you think stops first? Why?

> ______________________________________________

Now run it. Were you right? What did you miss?

> ______________________________________________

## 2. Separate the model from the view (15 minutes)

Make each change, then run the sketch. **The picture must not change.** If it does, undo
your last change.

1. Move `show()` out of the `Ball` class. Make it a function in the sketch called
   `drawBall(Ball b)`.
2. Change `move()` to `move(int w, int h)`, and use `w` and `h` instead of `width` and
   `height`.
3. Add a method `boolean isActive()` to `Ball` that returns `true` while `bounces` is less
   than 3. Use it everywhere the sketch checks `bounces < 3`.

## 3. Ask the collection a question (10 minutes)

Write a function in the sketch:

```java
/** Returns how many balls are still active. */
int countActive()
```

Show its result in the corner of the window with `text()`. Watch it count down from 4 to 0.

## 4. Test the model in plain Java (10 minutes)

Put `Ball.java`, `BallModel.java`, and `BallModelTest.java` in one folder. **Before you run
the tests**, write PASS or FAIL next to each test name in `BallModelTest.java`. Then run:

```
javac *.java
java BallModelTest
```

How many of your predictions were right? ______ out of 10

## 5. Explain (5 minutes)

Answer in full sentences.

1. When you deleted the drawing, the model kept running. What is the difference between a
   model and a view?
2. Why is it better to write `isActive()` once than to write `bounces < 3` in three places?
3. Name one test case you would add, and say what it would catch.

## What to hand in

- Your sketch, with the picture unchanged and "N active" in the corner.
- Your PASS/FAIL predictions, with the wrong ones circled.
- Your three answers from part 5.
