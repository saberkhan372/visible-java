# Visible Java — Processing to AP CS A

Two things share this site:

- **The Visible Java workshop** (`index.html`, `processing.html`, `session-1.html`): a free
  CC Fest Camp for educators: four workshops and a classroom studio on five Sundays,
  November 8–December 13, 2026, 7–9 a.m. PT / 10 a.m.–noon ET. Each meeting is a 90-minute
  core plus 30 optional studio minutes, and every session also works asynchronously.
- **The AP CS A course** (`course.html` and everything it links to): a full four-unit course,
  paced for five 50-minute periods a week, that the workshop sessions draw on.

**What makes the course distinctive:** every new idea is anchored to something students
can build in Processing. Students who have written sketches start ahead; students who
haven't can follow every lesson in plain Java.

**Design principle: make the local material coherent.** The course folder is the curriculum
source: existing handouts, labs, assessments, and examples are remixed into the current
four-unit CED sequence. External sites are optional practice. The distinctive connective
tissue is the Java/Processing comparison, translation layer, port exercise, and trap deck.

## Pages

| File | What it is |
|---|---|
| `index.html` | **Workshop home.** Interactive state model, five-session schedule, the four learning moves, and a short preparation checklist. |
| `processing.html` | **Workshop.** Your first sketch: install Processing, Java mode, Run, first-run problems, and three ways to run plain Java. |
| `session-1.html` | **Workshop.** Session 1, Make state visible (Sun Nov 8): the template for every session. Eight-block run of show (90-minute core + 30 studio), predictions with answers, supported and extension missions, Java transfer, colleague exchange, exit evidence, an On your own route, and facilitator notes. Files in `downloads/workshop/session-1/`, including an editable student handout and teacher guide. |
| `session-2.html`–`session-5.html` | **Workshop.** Make decisions visible (Nov 15), Make objects visible (Nov 22), Make learning transferable (Dec 6), and the Classroom studio (Dec 13), all on the Session 1 template. Files in `downloads/workshop/session-2/`–`session-5/`, each with a student handout and teacher guide. |
| `downloads/workshop/visible-java-2026.ics` | Calendar file for the five meetings (15:00–17:00 UTC). |
| `course.html` | Course entry for students: direct unit routes, first lesson, pacing calendar, and the Processing-to-Java connection. |
| `library.html` | Task-based directory for comparing, translating, porting, predicting output, and editor setup. |
| `calendar.html` | All 140 class days, week by week, for five 50-minute periods a week. Data in `assets/calendar.js`. |
| `unit1.html` | Broad Unit 1 overview and workbook dashboard: reference visual, Java anchor, resume state, editor profile, export, and eleven typed lessons. |
| `unit1/lesson-01.html`–`lesson-11.html` | Workbook lessons with predictions, verified projects, missions, evidence, AP transfer, optional Processing prompts, review, and assessment shapes. Data in `assets/unit1.js`; behavior in `assets/workbook.js`. |
| `unit2.html` | Broad Unit 2 overview and workbook dashboard: resume state, editor profile, export, and eleven typed lessons. |
| `unit2/lesson-12.html`–`lesson-22.html` | Workbook-model lessons: prediction, verified project, numbered missions, expected/actual evidence, AP transfer, optional Processing prompt, lab boundary, and assessment shape. Data in `assets/unit2.js`; behavior in `assets/workbook.js`. |
| `unit3.html` | Broad Unit 3 overview and workbook dashboard for class design and object behavior. |
| `unit3/lesson-23.html`–`lesson-35.html` | Thirteen workbook routes: ten verified Java projects, retrieval/FRQ work, and a protected assessment. Data in `assets/unit3.js`. |
| `unit4.html` | Broad Unit 4 overview, grouped into arcs 4A–4E. |
| `unit4/lesson-36.html`–`lesson-65.html` | Thirty workbook routes spanning data, arrays, files, ArrayList, 2D structures, search, sort, recursion, extended labs, review, and assessment. Data in `assets/unit4.js`. |
| `teacher.html` | Teacher-role, paste-in exit-slip aggregator. It sends and persists no student response data. |
| `audit.html` | **Not for students.** Type-aware coverage matrix over all 65 lessons. Required content, shared/custom presenter guidance, optional Processing, and annual Classroom configuration are reported separately. |
| `path.html` | Year timeline + broad route through the remixed course folder, unit by unit. |
| `examples.html` | **Original.** Ten programs in three runnable versions each, with copy buttons. Data in `assets/snippets.js`. |
| `translate.html` | **Original.** Every Processing habit → its AP CS A replacement. |
| `port.html` | **Original.** Port a sketch students already wrote into exam-legal Java, mapped onto FRQ types. |
| `traps.html` | **Original.** 18 predict-the-output problems. |
| `frq.html` | The four FRQ types, triage of old released questions, how to read a prompt. |
| `setup.html` | Leaving the PDE: IDEs, keeping graphics, week-one compiler errors. |
| `camp.html` | Interest-list entry and FAQ. The form field mapping is preserved; the workshop home owns the schedule. |
| `tools/create-processing-workshop-form.gs` | Run-once Google Apps Script that creates the interest form and linked response spreadsheet. Named before the program was called CC Fest Camp. |

### Interest form

`camp.html` posts directly to the published Google Form created by
`tools/create-processing-workshop-form.gs`, using hard-coded `entry.NNNN` field ids. Google
answers cross-origin with HTTP 200 whether or not the submission was accepted, so a stale
field id produces a success message and no row in the sheet. After **any** edit to the Form,
submit the live page once and confirm the row lands. Adding a section *break* in the Forms
editor also breaks submission, because the page posts `pageHistory=0`.

The email-consent checkbox posts the literal string `Yes, you may email me about this
workshop.` even though the page now says "camp". That string is the choice value stored in
the live Form and has to match byte for byte. Rename the program freely; leave that value
alone unless the Form is edited at the same time.

## Running it

The HTML/CSS/JavaScript site has no rendering build step and no backend. To serve it locally
from the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. Opening `index.html` directly from disk mostly works, but
serving it is closer to how it is published.

## Deploying

Any static host. This repository is published by pushing to GitHub. There is no login or
transmitted student data.

## The `private/` folder

`private/` is gitignored and never published. It holds interest-form responses, contact data,
and reference copies of other pages. Put anything with names, emails, or student data there,
or keep it out of this folder entirely. The Unit 1–4 workbooks store editor choice
and student-entered working progress in `localStorage` after interaction and export Markdown/JSON;
an untouched page need not create state. Teacher role and temporary display name use
`sessionStorage`. The LMS remains the system of record.

## Verifying the workshop files

Everything in `downloads/workshop/` is checked against Processing 4.3.4 and its bundled Java 17.
The page copy quotes real console output, so re-run these after any change to a sketch or `.java`
file. On a Mac with Processing in `/Applications` (adjust `JDK` for other versions):

```bash
JDK=/Applications/Processing.app/Contents/PlugIns/jdk-17.0.8+7/Contents/Home/bin
for f in downloads/workshop/session-1/plain-java/*.java; do "$JDK/java" "$f"; done
```

Sessions 1–3: each `.java` file runs as a single file with no compile step. Session 3 keeps
`BallWorld/` and `ArrayTrace/` in separate folders because each declares its own `Ball` class.
Session 4 is a multi-file project: compile the folder, then run the demo and the checks:

```bash
cd downloads/workshop/session-4/plain-java
"$JDK/javac" -d /tmp/vj4 *.java
"$JDK/java" -cp /tmp/vj4 BallModel
"$JDK/java" -cp /tmp/vj4 BallModelTest   # ten checks, all PASS
```

Compile the sketches from the Processing editor, or with Processing's command-line tool
(`processing-java --sketch=<folder> --build`). Then rebuild each session's zip from its folder
so the zip holds exactly what is on disk:

```bash
for n in 1 2 3 4 5; do
  (cd downloads/workshop/session-$n && rm -f ../session-$n-files.zip && zip -qrX ../session-$n-files.zip . -x '.*')
done
```

## Verifying and building workbook projects

**The workbook project sources and release scripts are not in this repository.** They live
in the private course source this site is published from. The Unit 1–4 ZIPs under
`downloads/unit1/` through `downloads/unit4/` are prebuilt release outputs; treat them as
read-only here. The course verification baseline is OpenJDK 17. In the course source, run:

```bash
../tools/verify.sh
../tools/build-bundles.sh
../tools/release.sh
```

`verify.sh` compiles all 51 starters and solutions and runs 366 checks against the solutions.
`build-bundles.sh` creates 51 student ZIP files without solution code. Unit 2 contains ten lesson
directories but nine Java projects because its Magpie companion intentionally does not republish
authorized source. `release.sh` performs both steps and verifies the course source’s 81 HTML pages (this published copy adds the workshop pages), 65 workbook routes,
51 manifests, skip links, main landmarks, downloads, local HTML links, every JavaScript asset's
syntax, workbook data schemas, and Present slide ordering. Node.js is required for the JavaScript
release checks. Processing verification is a separate optional gate and is not required for
standard-Java bundles.

The submission panel appears on all 47 build lessons. `assets/classroom-links.js` currently has no
active current-course URLs, so release verification warns for 47 lessons (18 in Units 1–2 and 29 in
Units 3–4). This does not block static publication, copy, or slip download; it only withholds the
per-lesson **Open Classroom** link until configuration is added.

## Editing content

**Traps and translation rows live in `assets/content.js`** — plain arrays at the top of the
file. Add an entry and it appears. Nothing else needs to change.

A trap looks like this:

```js
{
  id: 19, unit: "Unit 2", title: "Short descriptive name",
  code: `int x = 5;
System.out.println(x);`,
  output: "5",
  why: "Explain the misconception. HTML is allowed here."
}
```

- `code` is a template literal — write Java normally, no escaping. Syntax highlighting is
  automatic.
- `output` is what it actually prints. Use `\n` for multiple lines; each line renders as its
  own chip.
- `why` should name the *misconception*, not just restate the answer.

**The calendar lives in `assets/calendar.js`** — one object per lesson or block, in order,
with `n` (lesson number, or `null` for flex and review), `unit`, `topic`, `act`, `kind`
(`test` / `quiz` / `lab` / `frq` / `due` / `flex`), `days` (how many 50-minute periods it
takes), and `plan` (one line per period when `days` is more than 1). Week numbers, day numbers,
and the `when`/`length` labels lesson pages show are computed at the bottom of the file. Edit
`topic`/`act`/`kind`/`plan` freely; see **Pacing** before changing `days`.

**Legacy lesson-reader material lives in `assets/lessons.js`** — one object per calendar meeting,
with `concept`,
an optional `viz` (an id from `VIZ`), and two exercises: `ap` (required exam-form Java) and
`vp` (optional Java + Processing transfer). Each exercise is `{ prompt, starter, solution }`.
`LESSON_GUIDES` adds the daily target, launch, source handout, practice direction, and exit
ticket. Omit `ap`/`vp`/`viz` freely — review and test days have none.

⚠️ **Starters and solutions are template literals — no backticks inside them.** Use single
quotes when referring to a variable in a comment. A stray backtick silently breaks the file.

**Workbook lessons live in `assets/unit1.js` through `assets/unit4.js`.** Each entry declares its
lesson type, outcome, deliverable, prediction, project metadata, missions, checkpoints, AP transfer,
optional Processing prompt, and reflection. `assets/workbook.js` renders all 65 thin Unit 1–4
lesson routes, stores the shared local working copy, calculates Evidence ready, and handles
Markdown/JSON export. Standard-Java project sources stay in the private course source (`coursework/unit-1/` through
`coursework/unit-4/` there); edit those files and rebuild the student ZIPs rather than copying Java into
the page data.

`assets/lessons.js` is retained as source/reference material and no longer drives the Unit 1 routes.

## Two views and Classroom exit slips

Every Unit 1–4 lesson has a visible **Study view / Present view** switch. Present view can also be
opened directly by adding `?present=1` to its URL. The deck is available to students as a large-type
accessibility view. Teacher mode is selected with `?teacher=1`; the session-scoped amber badge
exposes presenter notes and the link to `teacher.html`. Teacher mode is a rendering convenience,
not access control, and presenter notes must never contain secrets or secure assessment content.
Build, review, and extended-lab lessons receive shared type-specific stage directions; individual
lessons may override them with more specific `present.notes`.

Build lessons add `stuck` and `unsure` evidence fields and a plain-text exit-slip preview. A student
copies or downloads the slip and submits it through the LMS. The student name is stored only for
the current tab; it is not added to the long-lived workbook state. `teacher.html` groups pasted
slips locally and clears them on reload.

Current-course Classroom Question URLs belong in `assets/classroom-links.js`, keyed by lesson id.
Keeping them outside the unit data files prevents annual Classroom IDs from becoming part of
the reusable curriculum. Missing links leave copy/download working and render a configuration note.

Relevant shared files:

- `assets/workbook.js`: study view, state migration, evidence status, exit slips, and exports.
- `assets/workbook-present.js`: derived slides, controls, timer, projection behavior, and note gate.
- `assets/role.js`: site-wide, session-only student/teacher rendering role.
- `assets/teacher-tools.js`: response parser and local class summaries.

**The three-view examples live in `assets/snippets.js`** — one object per example with
`processing`, `papplet` and `java` keys. **Every pane must be a complete, runnable program**,
because students copy them directly. The `papplet` version needs Processing's `core.jar` on
the classpath and uses `PApplet.main("ClassName")`; note `size()` belongs in `settings()`,
not `setup()`, when running outside the PDE.

Prose changes are plain HTML. The three primary routes are **Workshop, Course, Library**;
contextual links sit underneath. The interest-list action appears only in the workshop area.
Headers are static HTML, so navigation works without JavaScript. After changing navigation
in `tools/update-navigation.py`, run `python3 tools/update-navigation.py`; use `--check`
to detect drift without writing. Its page list includes only root HTML and the four known
lesson directories. Unit pages are reached through `course.html`, `path.html`, and the calendar.

**`port.html` uses real code from last year's sketches** (`Objects_with_arrays_and_nested_loops.pde`
and the Unit 3 grid project). If you change the Processing course, swap those examples for
whatever the new cohort actually built — the whole point is that students recognise the
left-hand column as their own work.

## Design notes

- The current direction is a creative-coding field guide: oversized type, open space,
  thin rules, numbered lesson rows, and a working state illustration. CC Fest's
  [current design](https://ccfest.rocks/) is the reference for scale and section rhythm;
  the illustration and content structure are specific to Visible Java.
- Claude's color semantics remain: mint = Processing/Run, sun = prediction/primary action,
  grape = objects/Change, sky = Java/Port, coral = traps/errors. Bright fills use
  `--on-fill`; quieter surfaces use the text-safe `-ink` colors.
- The playful layer sits on top of that layout, in one block at the end of
  `assets/site.css` ("Playful skin"): Fredoka headings, sticker buttons and tags (2px
  outline, pill shape, hard offset shadow), and the dot grid behind each landing hero.
  Rows, panels and bands keep their thin rules so teaching content stays easy to scan.
- The logo, `assets/visible-java-icon.svg`, is "Bloom": a grid of dots on a sun tile with
  three objects popping off it in mint, sky and grape. It is the masthead mark and every
  page's browser-tab icon.
- Motion comes from two effects, a riso misprint (pink, aqua and yellow ghost plates) and a
  colour cycle (the palette stepping through hues), and every piece is short and tied to a
  moment: the landing headlines drift for about 4.5 seconds on load, the hero dot grid steps
  once through the move colours, section headings come into register as they scroll in, the
  four moves' colour bars draw in, and the logo and numbered rows cycle colour on hover.
  Nothing loops, lessons stay still apart from the logo, and `prefers-reduced-motion` turns
  all of it off. The rules are the "Misprint" and "Motion kit" blocks at the end of
  `assets/site.css`.
- Light/dark themes and compatibility tokens remain in `assets/site.css`. Theme buttons
  read `--scheme`. Typography uses Fredoka for display, Atkinson Hyperlegible Next
  for reading, and Source Code Pro for code, all from Google Fonts with local fallbacks.
  `teacher.html` keeps its strict CSP and loads no web fonts.
- `assets/studio.js` powers the home illustration. It is a deterministic visual model,
  not a Java compiler. Nothing moves automatically; Step, Reset, and a labeled range
  input control it. Both code excerpts describe the same update rule. Without JavaScript,
  the illustration and Processing excerpt remain visible and inactive controls stay hidden.
- Browser checks: the landing pages, a session and a workbook lesson have been rendered
  at desktop width in light and dark, and ten pages at 375px with no sideways scroll.

## Deliberate omissions

- **No Java code execution.** Prediction exercises ask learners to commit before revealing
  an answer. The homepage has a small JavaScript state illustration, not an editor or compiler.
- **No hosted PDFs.** Released FRQs and the College Board lab guides are public on AP
  Central — link to those. The textbook PDF and the publisher's lab exercises in
  `AP Computer Science A 26-27/` should stay behind the LMS.
- **No inheritance content.** Removed from the exam in 2025. See below.

## Facts baked into the copy — recheck these each year

Verified July 2026 directly against the CED in
the 2025 AP Computer Science A CED in the private course materials:

- Four units. Weights: U1 15–25%, U2 25–35%, U3 10–18%, U4 30–40%.
- Exam: 42 MCQ / 90 min (55%) + 4 FRQ / 90 min (45%), fully digital in Bluebook.
- FRQ points: Q1 Methods & Control Structures 7 · Q2 Class Design 7 ·
  Q3 Data Analysis with ArrayList 5 · Q4 2D Array 6. Q1 Part B always requires
  `String` methods.
- MCQ skill weights: **Analyze Code 37–53%**, Develop Code 22–38%, Document 10–15%,
  Design 2–10%, Responsible Use 2–10%.
- **Cut in 2025:** inheritance, polymorphism, `extends`, `super`, interfaces, and *writing*
  recursive methods. The CED's exclusion statement covers *designing and implementing*
  inheritance — the vocabulary still appears in topic 1.12, so don't tell students the word
  won't show up.
- **Added in 2025:** text files with `Scanner`, working with data sets, recursion *tracing*,
  and `split` on the Java Quick Reference.
- Unit 1 source attributions were checked against the imported M&amp;M's Parameters, String
  Activity, String Four Corners, String Output Lineup, and Unit 1 More Labs handouts.

Claims about what sketch code contains ("a year of student sketches", "140 files") come from
measuring one full year of a Processing course's `.pde` files: zero 2D arrays, zero `String`
methods, zero file reading, `ArrayList` in only 4 files. The sketches themselves are student
work and stay out of this repository. The copy says "a year of sketches we measured" rather
than "your sketches", so it holds for any class.

If College Board revises the course again, `path.html`, `frq.html` and `course.html` are
where the version-specific claims live.

## Pacing

The course is paced for **five 50-minute periods a week: 140 class days over 28 weeks**,
school-neutral, with no dates. Many schools have about 30 instructional weeks before the May
exam, so 28 leaves slack, and eight flex days are already in the plan.

Day rules, applied in `assets/calendar.js`:

| Lesson type | Days |
|---|---|
| Build lesson | 2 (day 1: predict and first missions; day 2: checks, AP transfer, exit slip) |
| Extended lab | 2 |
| Review / FRQ practice | 1 |
| Unit 1–3 tests | 2 (multiple-choice day, free-response day) |
| Unit 4 section tests and quizzes | 1 |

By unit: Unit 1 22 days, Unit 2 23, Unit 3 25, Unit 4 58, exam review 12.

**If you change a lesson's `days`, also change:** its `duration` in `assets/unit1.js`–`unit4.js`
(Units 3–4 builder lessons get theirs from `lessonType`), each unit's `dates`/`meetings` in the
same files, the unit page eyebrows in `unit1.html`–`unit4.html`, and the timeline in
`path.html` (`.tl-when` and `.tl-blocks`). The calendar page and lesson pages update
themselves. The Present view's timer scales its 75-minute default split to `days × 50`.

## Never copy into this folder

These live in the private course materials and must never be added here:

- `Class Documents/2026 FRQ Student Samples/` — secure APSI material, explicitly not for
  websites.
- `Copy of C - Comp Prog in Java 2025 - 2026/` — contains named student work and recordings.
- Publisher PDFs (Lewis & Loftus, *Learning Processing*).

The site references all of these by name only; students get them through the LMS.
