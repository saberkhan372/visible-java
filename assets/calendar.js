/* Course pacing: five 50-minute periods a week, about 28 weeks before the AP exam.

   One entry per lesson or block, in order. `n` is the lesson number (1–65) and
   links the entry to its lesson page; flex and review entries have n: null.
   `days` is how many 50-minute periods the entry takes, and `plan` has one line
   per period when it takes more than one.

   Week and day numbers are computed at the bottom of this file. To re-pace the
   course, change `days` (and `plan`), or move a flex day. Nothing else changes. */

const PERIOD_MINUTES = 50;
const DAYS_PER_WEEK = 5;

const MEETINGS = [
  {"n":1,"unit":"Unit 1","topic":"Orientation — leaving the PDE","act":"IDE setup, <code>main</code>, file naming, first compile error. <strong>Port project assigned.</strong>","kind":"due","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":2,"unit":"Unit 1","topic":"1.1–1.6 speed-run","act":"Variables, types, expressions, casting, compound assignment. <code>float</code>→<code>double</code>, integer division. Diagnostic quiz.","kind":"quiz","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":3,"unit":"Unit 1","topic":"1.7, 1.8, 1.11","act":"APIs and libraries; comments and preconditions; the <code>Math</code> class.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":4,"unit":"Unit 1","topic":"1.9–1.10","act":"Method signatures; calling class methods. Mostly review.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":5,"unit":"Unit 1","topic":"1.12–1.13","act":"Objects as instances; instantiation and constructors.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":6,"unit":"Unit 1","topic":"1.14 + reference semantics","act":"Instance methods. <strong>Aliasing starts here</strong> — Java Visualizer, hand-drawn box-and-pointer traces.","kind":"lab","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":7,"unit":"Unit 1","topic":"1.15 Strings I","act":"<code>length</code>, <code>substring</code>, <code>indexOf</code>. Index arithmetic until it is automatic.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":8,"unit":"Unit 1","topic":"1.15 Strings II + Unit 4 preview","act":"<code>equals</code> and <code>compareTo</code>; optional preview of <code>split</code> (topic 4.6). String practice.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":9,"unit":"Unit 1","topic":"1.15 Strings III","act":"String algorithms practice. <strong>Port project due.</strong>","kind":"due","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":10,"unit":"Unit 1","topic":"Review","act":"Progress Checks 1.1–1.3. Loose ends.","kind":"","days":1,"plan":[]},
  {"n":null,"unit":"Unit 1","topic":"Flex day","act":"Catch up, reteach, or review before the test.","kind":"flex","days":1,"plan":[]},
  {"n":11,"unit":"Unit 1","topic":"<strong>Unit 1 Test</strong>","act":"Covers 1.1–1.15.","kind":"test","days":2,"plan":["Multiple-choice section.","Free-response section."]},
  {"n":12,"unit":"Unit 2","topic":"2.1–2.3 speed-run","act":"Algorithms with selection; boolean expressions; <code>if</code>. Confirm, don't teach.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":13,"unit":"Unit 2","topic":"2.4–2.5","act":"Nested <code>if</code>; compound boolean expressions.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":14,"unit":"Unit 2","topic":"2.6 De Morgan's Laws I","act":"<strong>New.</strong> Truth tables; what <code>!</code> does to <code>&amp;&amp;</code> and <code>||</code>.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":15,"unit":"Unit 2","topic":"2.6 De Morgan's Laws II","act":"Negating compound conditions. CodingBat Logic-1.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":16,"unit":"Unit 2","topic":"2.7–2.8","act":"<code>while</code> and <code>for</code>. Review — the work is <em>tracing</em>, not writing.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":17,"unit":"Unit 2","topic":"2.10 String algorithms I","act":"<strong>New.</strong> Looping through a string one character at a time.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":18,"unit":"Unit 2","topic":"2.10 String algorithms II","act":"CodingBat String-2. Building and comparing substrings.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":19,"unit":"Unit 2","topic":"2.9, 2.11","act":"Implementing selection/iteration algorithms; nested iteration.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":20,"unit":"Unit 2","topic":"2.12 Runtime analysis","act":"<strong>New, and easy points.</strong> Counting how many times a loop body runs.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":21,"unit":"Unit 2","topic":"Magpie Chatbot Lab","act":"College Board lab — pure <code>if</code> + <code>indexOf</code>. <em>Counts toward the lab requirement.</em> First timed MCQ set.","kind":"lab","days":2,"plan":["Read the lab, plan, and reach the first checkpoint.","Finish the lab, verify it against the checks, and record evidence."]},
  {"n":null,"unit":"Unit 2","topic":"Flex day","act":"Catch up, reteach, or review before the test.","kind":"flex","days":1,"plan":[]},
  {"n":22,"unit":"Unit 2","topic":"<strong>Unit 2 Test</strong>","act":"Covers 2.1–2.12.","kind":"test","days":2,"plan":["Multiple-choice section.","Free-response section."]},
  {"n":23,"unit":"Unit 3","topic":"3.1–3.2","act":"Abstraction and program design; impact of program design.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":24,"unit":"Unit 3","topic":"3.3 Anatomy of a class","act":"Class header, instance variables. <strong>Full rigour on <code>private</code></strong>: sketch code almost never uses access modifiers.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":25,"unit":"Unit 3","topic":"3.4 Constructors","act":"Parameters, initialising every field.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":26,"unit":"Unit 3","topic":"3.4 continued","act":"Overloaded constructors. Design practice.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":27,"unit":"Unit 3","topic":"3.5 Writing methods I","act":"<strong>Return values.</strong> Sketch methods rarely return anything; exam methods return constantly.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":28,"unit":"Unit 3","topic":"3.5 Writing methods II","act":"Accessors, mutators, <code>toString</code>.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":29,"unit":"Unit 3","topic":"3.6 References","act":"Passing and returning object references. Aliasing from the writing side.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":30,"unit":"Unit 3","topic":"3.7 <code>static</code> I","act":"<strong>Genuinely new.</strong> Class variables shared across instances.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":31,"unit":"Unit 3","topic":"3.7 <code>static</code> II","act":"Why a static method cannot touch an instance variable.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":32,"unit":"Unit 3","topic":"3.8–3.9","act":"Scope, access, and the <code>this</code> keyword.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":33,"unit":"Unit 3","topic":"FRQ Question 2 practice","act":"Write a complete class by hand. CupcakeMachine.","kind":"frq","days":1,"plan":[]},
  {"n":34,"unit":"Unit 3","topic":"Retrieval + FRQ Q2 practice","act":"Rebuild the class pattern cold, then StepTracker by hand. Progress Checks 3.1–3.2. Works best right after a break.","kind":"frq","days":1,"plan":[]},
  {"n":null,"unit":"Unit 3","topic":"Flex day","act":"Catch up, reteach, or review before the test.","kind":"flex","days":1,"plan":[]},
  {"n":35,"unit":"Unit 3","topic":"<strong>Unit 3 Test</strong>","act":"Covers 3.1–3.9. <em>Skipped entirely: inheritance, <code>extends</code>, <code>super</code>, interfaces.</em>","kind":"test","days":2,"plan":["Multiple-choice section.","Free-response section."]},
  {"n":36,"unit":"Unit 4A","topic":"4.1 Ethics and data","act":"Ethical and social issues around data collection, including AI. <em>Practice 5 is 2–10% of the MCQ.</em>","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":37,"unit":"Unit 4A","topic":"4.2 Data sets","act":"<strong>New in 2025.</strong> Reasoning about which data answers a question.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":38,"unit":"Unit 4A","topic":"4.3 Array creation and access","act":"Review — but watch <code>.length</code> vs <code>.length()</code> vs <code>.size()</code>.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":39,"unit":"Unit 4A","topic":"4.4 Array traversals","act":"Standard traversal patterns.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":40,"unit":"Unit 4A","topic":"4.4 Enhanced <code>for</code>","act":"What the for-each loop cannot do. CodingBat Array-1.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":41,"unit":"Unit 4A","topic":"4.5 Array algorithms I","act":"Min, max, sum, count, search.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":42,"unit":"Unit 4A","topic":"4.5 Array algorithms II","act":"Shifting and rearranging. FRQ practice.","kind":"frq","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":null,"unit":"Unit 4A","topic":"Flex day","act":"Catch up, reteach, or review before the test.","kind":"flex","days":1,"plan":[]},
  {"n":43,"unit":"Unit 4A","topic":"<strong>Unit 4A Test</strong>","act":"1D arrays and data sets.","kind":"test","days":1,"plan":[]},
  {"n":44,"unit":"Unit 4B","topic":"4.6 File and Scanner","act":"<strong>New to everyone.</strong> <code>File</code>, <code>Scanner</code>, <code>hasNext</code>. ⚠️ <code>hasNextLine</code>/<code>hasNextInt</code> are <em>not</em> on the reference sheet.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":45,"unit":"Unit 4B","topic":"4.6 Reading line by line","act":"Inventory Auditor lab.","kind":"lab","days":2,"plan":["Read the lab, plan, and reach the first checkpoint.","Finish the lab, verify it against the checks, and record evidence."]},
  {"n":46,"unit":"Unit 4B","topic":"4.6 Parsing with <code>split</code>","act":"Weather Data Analyzer lab — nested loops over file data.","kind":"lab","days":2,"plan":["Read the lab, plan, and reach the first checkpoint.","Finish the lab, verify it against the checks, and record evidence."]},
  {"n":47,"unit":"Unit 4B","topic":"Files wrap-up","act":"Gradebook Validator lab + quiz.","kind":"quiz","days":2,"plan":["Read the lab, plan, and reach the first checkpoint.","Finish the lab, verify it against the checks, and record evidence."]},
  {"n":null,"unit":"Unit 4B","topic":"Flex day","act":"Catch up or extend the labs before the next section.","kind":"flex","days":1,"plan":[]},
  {"n":48,"unit":"Unit 4C","topic":"4.7 Wrapper classes","act":"<code>Integer</code>, <code>Double</code>, autoboxing.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":49,"unit":"Unit 4C","topic":"4.8 ArrayList methods","act":"<code>add</code>, <code>get</code>, <code>set</code>, <code>remove</code>, <code>size</code>.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":50,"unit":"Unit 4C","topic":"4.9 ArrayList traversals","act":"Index and for-each.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":51,"unit":"Unit 4C","topic":"4.10 ArrayList algorithms","act":"<strong>Removal during traversal</strong> — practise until it stops biting.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":52,"unit":"Unit 4C","topic":"FRQ Question 3 practice","act":"Data analysis with <code>ArrayList</code>. Two lists compared against each other.","kind":"frq","days":1,"plan":[]},
  {"n":53,"unit":"Unit 4C","topic":"ArrayList quiz + MCQ set","act":"Timed.","kind":"quiz","days":1,"plan":[]},
  {"n":null,"unit":"Unit 4C","topic":"Flex day","act":"Catch up or extend the labs before the next section.","kind":"flex","days":1,"plan":[]},
  {"n":54,"unit":"Unit 4D","topic":"4.11 2D creation and access","act":"<strong>Completely new.</strong> Open with a grid sketch: <code>x / cellSize</code> was a column index all along.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":55,"unit":"Unit 4D","topic":"4.12 Nested loop traversals","act":"Row-major order. <code>grid.length</code> vs <code>grid[0].length</code>.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":56,"unit":"Unit 4D","topic":"4.13 2D algorithms","act":"Row sums, column scans, finding a match.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":57,"unit":"Unit 4D","topic":"Picture Lab I","act":"2D arrays over pixels — mirroring. <em>Lab requirement.</em> The most Processing-like thing in the course.","kind":"lab","days":2,"plan":["Read the lab, plan, and reach the first checkpoint.","Finish the lab, verify it against the checks, and record evidence."]},
  {"n":58,"unit":"Unit 4D","topic":"Picture Lab II","act":"Collage and edge detection.","kind":"lab","days":2,"plan":["Read the lab, plan, and reach the first checkpoint.","Finish the lab, verify it against the checks, and record evidence."]},
  {"n":59,"unit":"Unit 4E","topic":"Retrieval","act":"Recall 2D arrays and <code>ArrayList</code> cold. No new content. Place it right after your longest break.","kind":"","days":1,"plan":[]},
  {"n":60,"unit":"Unit 4E","topic":"FRQ Question 4 practice","act":"2D array question under time.","kind":"frq","days":1,"plan":[]},
  {"n":null,"unit":"Unit 4E","topic":"Flex day","act":"Catch up, reteach, or review before the test.","kind":"flex","days":1,"plan":[]},
  {"n":61,"unit":"Unit 4E","topic":"<strong>Unit 4D Test</strong>","act":"2D arrays.","kind":"test","days":1,"plan":[]},
  {"n":62,"unit":"Unit 4E","topic":"4.14 Searching","act":"Sequential and binary search; when each applies.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":63,"unit":"Unit 4E","topic":"4.15 Sorting","act":"Selection, insertion, merge. Comparative efficiency.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":64,"unit":"Unit 4E","topic":"4.16 Recursion","act":"<strong>Tracing only.</strong> Base cases, unwinding, spotting infinite recursion. You will never be asked to write one.","kind":"","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":65,"unit":"Unit 4E","topic":"4.17 Recursive search/sort + quiz","act":"Tracing merge sort and binary search.","kind":"quiz","days":2,"plan":["Predict, model, and start the project: first missions.","Finish the missions, run the checks, AP transfer, exit slip."]},
  {"n":null,"unit":"Review","topic":"Flex day","act":"Close out Unit 4 before the review block. Every school loses days; this is one to spend.","kind":"flex","days":1,"plan":[]},
  {"n":null,"unit":"Review","topic":"Full timed MCQ section","kind":"test","days":2,"act":"42 questions, 90 minutes, no notes, split across two periods. Diagnose honestly.","plan":["Questions 1–21, 45 minutes.","Questions 22–42, 45 minutes. Score both halves."]},
  {"n":null,"unit":"Review","topic":"Targeted reteach","kind":"","days":2,"act":"Driven entirely by the diagnostic.","plan":["The weakest topic from the diagnostic.","The second weakest, then retest the first."]},
  {"n":null,"unit":"Review","topic":"FRQ Q1 + Q2 under time","kind":"frq","days":2,"act":"Both worth 7 points. Q1 Part B will need <code>String</code> methods.","plan":["Q1 Methods and Control Structures, then score it.","Q2 Class Design, then score it."]},
  {"n":null,"unit":"Review","topic":"FRQ Q3 + Q4 under time","kind":"frq","days":2,"act":"<code>ArrayList</code> (5 points) and 2D array (6 points).","plan":["Q3 Data Analysis with ArrayList, then score it.","Q4 2D Array, then score it."]},
  {"n":null,"unit":"Review","topic":"Java Quick Reference + Bluebook","kind":"","days":2,"act":"Walk the reference sheet end to end, then practice in the testing app.","plan":["The Java Quick Reference, end to end.","A timed Bluebook practice section."]},
  {"n":null,"unit":"Review","topic":"Logistics","kind":"","days":1,"act":"Exam mechanics, what to bring, timing strategy. No new content.","plan":[]}
];

/* ---- computed: course day, week, and display labels ---- */
(function () {
  let day = 1;
  MEETINGS.forEach((m) => {
    m.firstDay = day;
    m.lastDay = day + m.days - 1;
    m.firstWeek = Math.ceil(m.firstDay / DAYS_PER_WEEK);
    m.lastWeek = Math.ceil(m.lastDay / DAYS_PER_WEEK);
    const days = m.days > 1 ? `Days ${m.firstDay}–${m.lastDay}` : `Day ${m.firstDay}`;
    const weeks = m.firstWeek === m.lastWeek ? `Week ${m.firstWeek}` : `Weeks ${m.firstWeek}–${m.lastWeek}`;
    m.when = `${weeks} · ${days}`;
    m.length = m.days > 1 ? `${m.days} × ${PERIOD_MINUTES} min` : `${PERIOD_MINUTES} min`;
    /* Older renderers read date/time/rot. */
    m.date = m.when;
    m.time = m.length;
    m.rot = "";
    day += m.days;
  });
})();

const TOTAL_DAYS = MEETINGS.reduce((sum, m) => sum + m.days, 0);
const TOTAL_WEEKS = Math.ceil(TOTAL_DAYS / DAYS_PER_WEEK);
