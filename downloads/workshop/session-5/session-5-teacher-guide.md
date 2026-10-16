# Studio guide: Classroom studio

For Meeting 5. No new Java. Participants bring one lesson package from any session,
test it on colleagues, get structured feedback, and revise it.

## The package checklist

A lesson package is ready to teach when it has all of these.

- [ ] **Student directions** with a time, a "you need" line, and plain-language steps.
- [ ] **A prediction before any Run.** Students commit to an answer, in writing, before
      the computer shows them.
- [ ] **Two levels in the same project:** steps everyone does, and an extension for those
      who finish.
- [ ] **A way back in:** a checkpoint file, so a student who falls behind or was absent
      can rejoin mid-lesson.
- [ ] **Expected evidence:** what a student who understands will write, with the answers.
- [ ] **Assessment criteria:** at least one criterion that looks at reasoning, not at the
      finished sketch.
- [ ] **Likely misconceptions,** and the question that brings each one out.
- [ ] **An implementation plan:** course, week, timing, and what you'll cut for your class.

`session-5-student-handout.md` is a blank student handout in the same shape as the
Session 1-4 handouts.

## Critique protocol (12 minutes per lesson)

Groups of three. Each person presents once. One person keeps time.

1. **Context, 2 minutes.** The presenter says who the students are and where the lesson
   lands. No apologies or disclaimers.
2. **Try it, 3 minutes.** The other two do the first three minutes of the lesson as
   students would, out loud.
3. **Clarifying questions, 1 minute.** Questions with short factual answers only.
4. **Warm feedback, 2 minutes.** "What will work for students is..."
5. **Cool feedback, 2 minutes.** "I wonder where a student would get stuck when..." Point
   to a line, a question, or a minute, not to the lesson as a whole.
6. **One change, 2 minutes.** The presenter names the one change they will make, and makes
   it before the end of the meeting.

The presenter listens during steps 4 and 5 and does not respond. That's the hardest rule,
and the most useful.

## What to listen for

- A prediction that can be checked: "what will the console print" beats "what do you
  think will happen".
- Instructions that rely on the teacher's voice. If a student working alone couldn't
  follow a step, the handout needs one more sentence.
- An extension that is just "more of the same". A good extension asks a new question
  of the same project.

## Optional extension: AI-generated code as a prediction task

Use AI-generated code as something to predict and test, not as an answer key.

1. Ask an AI assistant for a variation of your starter sketch, for example: "Change this
   Processing sketch so the ball speeds up each time it hits a wall."
2. **Don't run it yet.** Students read the code and predict what it will do, in writing.
3. Run it. Compare it with the predictions and with the request. Find at least one place
   where the code does something other than what was asked, or does it in a way the class
   hasn't learned.
4. Students write one sentence on whether they would trust the code, and why.

Never make an AI tool a requirement. Every step works with code a student or teacher wrote.

## Optional extension: a hardware sensor as input

`SensorStandIn` moves a ball left or right based on a number from 0 to 1023, the range an
Arduino analog pin reports. The number comes from `readSensor()`, which uses the mouse's
position as a stand-in. With the mouse at the right edge it reports 1023 and the ball moves
right. At the left edge it reports 0 and the ball moves left.

To use a real sensor, replace the body of `readSensor()` with a value read through
Processing's Serial library. Plan the lesson so the stand-in is always available: a
student without hardware does the same lesson with the mouse.

## On your own

If you can't attend: use the checklist on your own package, then ask one colleague to do
the first three minutes of it as a student. Ask them only the two critique questions:
what will work, and where a student would get stuck. Make one change, and write one
sentence explaining it.
