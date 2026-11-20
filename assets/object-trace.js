/* Session 3 · Step through one frame of TrafficLightFlags.
   A guided trace, not a Java interpreter: one frame where green turns to yellow,
   shown line by line, with the object each method runs on. The steps, call and
   return points come from a Codex walkthrough (work/traffic-light-code-trace);
   the display uses the site's lab styles. Starting values are made up for the
   example: green on, counter 179, car at x 40, speed 3. */
(function () {
  var root = document.querySelector('[data-object-trace]');
  if (!root) { return; }
  var $ = function (s) { return root.querySelector(s); };

  // Excerpts from downloads/workshop/session-3/TrafficLightFlags/TrafficLightFlags.pde
  var code = {
    draw: ['counter = counter + 1;', 'if (counter >= 180) {', '  changeLight();', '  counter = 0;', '}', 'if (green.isOn()) {', '  car.setSpeed(3);', '} else if (yellow.isOn()) {', '  car.setSpeed(1);', '} else {', '  car.setSpeed(0);', '}', 'car.move();', '// Road, pole, lights and car are drawn.'],
    change: ['if (green.isOn()) {', '  turnOn(yellow);', '} else if (yellow.isOn()) {', '  turnOn(red);', '} else {', '  turnOn(green);', '}'],
    turn: ['red.setOn(false);', 'yellow.setOn(false);', 'green.setOn(false);', 'light.setOn(true);'],
    getter: ['public boolean isOn() {', '  return on;', '}'],
    setter: ['public void setOn(boolean on) {', '  this.on = on;', '}'],
    speed: ['public void setSpeed(int speed) {', '  this.speed = speed;', '}'],
    move: ['public void move() {', '  x = x + speed;', '  if (x > width) {', '    x = -120;', '  }', '}']
  };
  var names = { draw: 'draw() · sketch', change: 'changeLight() · sketch', turn: 'turnOn(Light light) · sketch', getter: 'Light.isOn()', setter: 'Light.setOn(boolean on)', speed: 'Car.setSpeed(int speed)', move: 'Car.move()' };

  // The steps. Each records which line runs, which object it runs on, and the state after it.
  var state = { counter: 179, red: false, yellow: false, green: true, speed: 3, x: 40, picture: 'green', pictureX: 40 };
  var steps = [];
  function add(fn, line, stack, receiver, detail, patch, reference) {
    Object.assign(state, patch || {});
    steps.push({ fn: fn, line: line, stack: stack, receiver: receiver, detail: detail, state: Object.assign({}, state), reference: reference || '' });
  }
  add('draw', -1, 'draw()', '', 'Start with green on. Each row of the table is a different object; all three lights use the same Light class.');
  add('draw', 0, 'draw()', '', 'The sketch adds one to its counter: 180.', { counter: 180 });
  add('draw', 1, 'draw()', '', '180 >= 180 is true, so this frame changes the light.');
  add('draw', 2, 'draw() → changeLight()', '', 'Call changeLight(). draw() waits here until it finishes.');
  add('change', 0, 'draw() → changeLight() → green.isOn()', 'green', 'Ask the green object whether its own on field is true.');
  add('getter', 1, 'draw() → changeLight() → green.isOn()', 'green', 'green returns true. A getter reads its field; it does not change it.');
  add('change', 1, 'draw() → changeLight() → turnOn(yellow)', 'yellow', 'Pass a reference to the yellow object that already exists. No new light is made.', {}, 'light → yellow (the same object)');
  add('turn', 0, 'draw() → changeLight() → turnOn(yellow)', 'red', 'Call red.setOn(false).', {}, 'light → yellow');
  add('setter', 1, 'turnOn(yellow) → red.setOn(false)', 'red', 'Here, this means red. Its on field stays false.', { red: false }, 'this → red · parameter on = false');
  add('turn', 1, 'draw() → changeLight() → turnOn(yellow)', 'yellow', 'Call the same setter on the yellow object.', {}, 'light → yellow');
  add('setter', 1, 'turnOn(yellow) → yellow.setOn(false)', 'yellow', 'Here, this means yellow. Its on field stays false.', { yellow: false }, 'this → yellow · parameter on = false');
  add('turn', 2, 'draw() → changeLight() → turnOn(yellow)', 'green', 'Call the same setter on the green object.', {}, 'light → yellow');
  add('setter', 1, 'turnOn(yellow) → green.setOn(false)', 'green', 'Only green changes. For a moment, all three lights are off.', { green: false }, 'this → green · parameter on = false');
  add('turn', 3, 'draw() → changeLight() → turnOn(yellow)', 'yellow', 'light refers to yellow, so this call goes to yellow.', {}, 'light → yellow');
  add('setter', 1, 'turnOn(yellow) → yellow.setOn(true)', 'yellow', 'The same setter now changes yellow.on to true.', { yellow: true }, 'this → yellow · parameter on = true');
  add('draw', 3, 'draw()', '', 'Both helper methods have returned. Reset the counter; the car has not moved yet.', { counter: 0 });
  add('draw', 5, 'draw() → green.isOn()', 'green', 'Ask green before choosing the car’s speed.');
  add('getter', 1, 'draw() → green.isOn()', 'green', 'green returns false, so car.setSpeed(3) is skipped.');
  add('draw', 7, 'draw() → yellow.isOn()', 'yellow', 'Next, ask yellow.');
  add('getter', 1, 'draw() → yellow.isOn()', 'yellow', 'yellow returns true. The sketch takes the yellow branch.');
  add('draw', 8, 'draw() → car.setSpeed(1)', 'car', 'The sketch tells the car its new speed. Yellow never calls the car.');
  add('speed', 1, 'draw() → car.setSpeed(1)', 'car', 'this is car. Its private speed changes from 3 to 1.', { speed: 1 }, 'this → car · parameter speed = 1');
  add('draw', 12, 'draw() → car.move()', 'car', 'Now ask the car to move, using its own fields.');
  add('move', 1, 'draw() → car.move()', 'car', 'x = 40 + 1. Changing the speed did not move the car; move() does.', { x: 41 }, 'this → car');
  add('move', 2, 'draw() → car.move()', 'car', '41 > 600 is false, so the wraparound is skipped.');
  add('draw', 13, 'draw()', '', 'Drawing finishes the frame: yellow is lit and the car is at x 41.', { picture: 'yellow', pictureX: 41 });

  // Where each step sits in the panes: [draw line, helper, helper line].
  var layout = [
    [-1, 'change', -1], [0, 'change', -1], [1, 'change', -1], [2, 'change', -1],
    [2, 'change', 0], [2, 'change', 0], [2, 'change', 1],
    [2, 'turn', 0], [2, 'turn', 0], [2, 'turn', 1], [2, 'turn', 1], [2, 'turn', 2], [2, 'turn', 2], [2, 'turn', 3], [2, 'turn', 3],
    [3, 'change', -1], [5, 'change', -1], [5, 'change', -1], [7, 'change', -1], [7, 'change', -1], [8, 'change', -1], [8, 'change', -1], [12, 'change', -1], [12, 'change', -1], [12, 'change', -1], [13, 'change', -1]
  ];
  // Add an explicit return step after each method finishes.
  var returns = {
    5: ['helper', 'true → changeLight()'], 8: ['helper', 'red.setOn(false) → turnOn(yellow)'], 10: ['helper', 'yellow.setOn(false) → turnOn(yellow)'],
    12: ['helper', 'green.setOn(false) → turnOn(yellow)'], 14: ['helper', 'yellow.setOn(true) → turnOn(yellow)'],
    17: ['draw', 'false → draw(): skip the green branch'], 19: ['draw', 'true → draw(): take the yellow branch'],
    21: ['draw', 'car.setSpeed(1) → draw()'], 24: ['draw', 'car.move() → draw()']
  };
  var expanded = [];
  steps.forEach(function (t, i) {
    var pane = t.fn === 'draw' ? 'draw' : (t.fn === 'turn' || t.fn === 'change' ? 'helper' : 'method');
    var item = Object.assign({}, t, { drawLine: layout[i][0], helper: layout[i][1], helperLine: layout[i][2], pane: pane, method: pane === 'method' ? t.fn : null, methodLine: pane === 'method' ? t.line : -1 });
    expanded.push(item);
    if (returns[i]) {
      var detail = i === 5 ? 'Return true to the if in changeLight().'
        : i === 17 ? 'Return false to draw(). The green branch is skipped.'
        : i === 19 ? 'Return true to draw(). Next, call car.setSpeed(1).'
        : 'The method is finished. The caller picks up where it left off; the fields keep their new values.';
      expanded.push(Object.assign({}, item, { pane: returns[i][0], returned: true, jump: 'RETURN: ' + returns[i][1], detail: detail }));
    }
    if (i === 14) {
      expanded.push(Object.assign({}, item, { pane: 'helper', helper: 'change', helperLine: 1, method: null, returned: true, jump: 'RETURN: turnOn(yellow) → changeLight()', detail: 'All four setters have finished. turnOn returns to changeLight().' }));
      expanded.push(Object.assign({}, item, { pane: 'draw', method: null, returned: true, jump: 'RETURN: changeLight() → draw()', detail: 'changeLight() is finished. draw() picks up again and resets the counter next.' }));
    }
  });
  steps = expanded;
  root.traceSteps = steps;   // read by checks; not used by the page

  // The picture: the same drawing as the slides' TrafficLightFlags demo, 600 × 400.
  var ON = { red: [230, 40, 40], yellow: [250, 210, 40], green: [60, 200, 80] };
  function paint(g, light, carX) {
    function rgb(c) { return 'rgb(' + c.join(',') + ')'; }
    function shape(path, fill, stroke) {
      g.beginPath(); path();
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.lineWidth = 1; g.strokeStyle = '#000'; g.stroke(); }
    }
    function rect(x, y, w, h, r, fill, stroke) {
      shape(function () {
        if (!r) { g.rect(x, y, w, h); return; }
        g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
        g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
      }, fill, stroke);
    }
    function ellipse(x, y, d, fill) { shape(function () { g.arc(x, y, d / 2, 0, Math.PI * 2); }, fill, true); }
    g.fillStyle = 'rgb(185,220,250)'; g.fillRect(0, 0, 600, 400);
    rect(0, 300, 600, 100, 0, 'rgb(70,70,70)');
    for (var x = 0; x < 600; x += 60) { rect(x, 357, 30, 6, 0, 'rgb(255,210,0)'); }
    rect(carX + 25, 280, 65, 30, 8, 'rgb(30,90,200)', true);
    rect(carX, 305, 120, 35, 8, 'rgb(30,90,200)', true);
    ellipse(carX + 25, 340, 28, 'rgb(20,20,20)');
    ellipse(carX + 95, 340, 28, 'rgb(20,20,20)');
    rect(505, 210, 10, 90, 0, 'rgb(60,60,60)', true);
    rect(475, 20, 70, 190, 10, 'rgb(60,60,60)', true);
    [['red', 55], ['yellow', 115], ['green', 175]].forEach(function (l) {
      var on = ON[l[0]];
      ellipse(510, l[1], 50, rgb(light === l[0] ? on : on.map(function (v) { return Math.floor(v / 3); })));
    });
  }

  var at = 0, timer = null, lastPane = null;
  var scene = $('[data-scene]').getContext('2d');
  scene.scale(2, 2);
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var methodCall = function (t) { return t.method === 'getter' || t.fn === 'getter' ? 'isOn()' : t.method === 'setter' || t.fn === 'setter' ? 'setOn(…)' : t.method === 'speed' || t.fn === 'speed' ? 'setSpeed(1)' : 'move()'; };

  function lines(target, source, index, mode) {
    var box = $(target);
    box.textContent = '';
    source.forEach(function (text, i) {
      var span = document.createElement('span');
      span.className = 'lab-line' + (i === index && mode ? ' is-' + mode : '');
      span.textContent = text;
      box.appendChild(span);
    });
  }

  function stop() {
    if (timer) { clearInterval(timer); }
    timer = null;
    $('[data-play]').textContent = at === steps.length - 1 ? 'Replay' : 'Play';
  }

  function render() {
    var t = steps[at], s = t.state;
    $('[data-progress]').textContent = (at + 1) + ' / ' + steps.length;
    lines('[data-draw]', code.draw, t.drawLine, t.pane === 'draw' ? (t.returned ? 'returned' : 'active') : 'waiting');
    $('[data-helper-title]').textContent = names[t.helper];
    lines('[data-helper]', code[t.helper], t.helperLine, t.pane === 'helper' ? (t.returned ? 'returned' : 'active') : (t.pane === 'method' && t.helperLine >= 0 ? 'waiting' : ''));
    $('[data-method-title]').textContent = t.method ? names[t.method] : 'Class method';
    lines('[data-method]', t.method ? code[t.method] : ['// No class method running.'], t.pane === 'method' ? t.methodLine : -1, 'active');
    $('[data-reference]').textContent = t.method ? 'this → ' + t.receiver + (t.reference.indexOf('parameter') > -1 ? ' · ' + t.reference.split(' · ')[1] : '') : t.reference;

    var jump = t.jump;
    if (!jump) {
      if (t.pane === 'method') { jump = 'INSIDE ' + t.receiver + '.' + methodCall(t) + ' · this is ' + t.receiver; }
      else if (t.stack.indexOf('→') > -1) { jump = 'CALL: ' + t.stack; }
      else { jump = at === steps.length - 1 ? 'FRAME DONE · draw() finishes' : 'RUNNING draw()'; }
    }
    $('[data-jump]').textContent = jump;
    $('[data-path]').textContent = t.pane === 'draw' ? 'draw()'
      : t.pane === 'helper' ? 'draw() → ' + (t.helper === 'turn' ? 'changeLight() → turnOn(yellow)' : 'changeLight()')
      : 'draw() → ' + (t.helperLine >= 0 ? (t.helper === 'turn' ? 'changeLight() → turnOn(yellow) → ' : 'changeLight() → ') : '') + t.receiver + '.' + methodCall(t);
    var arrow = $('[data-direction]');
    arrow.textContent = t.returned ? '←' : t.pane === 'method' ? '↘' : '→';
    if (lastPane !== t.pane && !reduced && arrow.animate) {
      arrow.animate([{ transform: 'translateX(' + (t.returned ? 10 : -10) + 'px)' }, { transform: 'translateX(0)' }], { duration: 500, easing: 'ease-out' });
    }
    lastPane = t.pane;

    ['red', 'yellow', 'green'].forEach(function (name) { $('[data-value="' + name + '"]').textContent = 'on = ' + s[name]; });
    $('[data-value="car"]').textContent = 'x = ' + s.x + ', speed = ' + s.speed;
    root.querySelectorAll('[data-object]').forEach(function (row) { row.classList.toggle('is-receiver', row.dataset.object === t.receiver); });
    $('[data-counter]').textContent = 'counter = ' + s.counter;
    $('[data-detail]').textContent = t.detail;
    paint(scene, s.picture, s.pictureX);
    $('[data-picture]').textContent = 'Last finished frame: ' + s.picture + ' light, car.x = ' + s.pictureX;
    $('[data-scene]').setAttribute('aria-label', 'Last finished frame: ' + s.picture + ' light, blue car at x ' + s.pictureX);
    $('[data-back]').disabled = at === 0;
    $('[data-next]').disabled = at === steps.length - 1;
    if (!timer) { $('[data-play]').textContent = at === steps.length - 1 ? 'Replay' : 'Play'; }
  }

  $('[data-next]').addEventListener('click', function () { stop(); at = Math.min(at + 1, steps.length - 1); render(); });
  $('[data-back]').addEventListener('click', function () { stop(); at = Math.max(at - 1, 0); render(); });
  $('[data-play]').addEventListener('click', function () {
    if (timer) { stop(); return; }
    if (at === steps.length - 1) { at = 0; }
    timer = setInterval(function () { at++; if (at === steps.length - 1) { stop(); } render(); }, 1800);
    $('[data-play]').textContent = 'Pause';
    render();
  });
  render();
})();
