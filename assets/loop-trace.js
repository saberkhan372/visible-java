/* Session 3 · The whole loop of TrafficLightFlags in eight steps.
   Runs a small model of the sketch frame by frame (frames 1 to 541, no clicks),
   records which lines run, and groups the frames into steps: each light change,
   and the stretches in between. Values are the sketch's own, from setup() on. */
(function () {
  var DRAW = ['counter = counter + 1;', 'if (counter >= 180) {', '  changeLight();', '  counter = 0;', '}', 'if (green.isOn()) {', '  car.setSpeed(3);', '} else if (yellow.isOn()) {', '  car.setSpeed(1);', '} else {', '  car.setSpeed(0);', '}', 'car.move();', '// Road, pole, lights and car are drawn.'];
  var HELPERS = ['public void changeLight() {', '  if (green.isOn()) {', '    turnOn(yellow);', '  } else if (yellow.isOn()) {', '    turnOn(red);', '  } else {', '    turnOn(green);', '  }', '}', '', 'public void turnOn(Light light) {', '  red.setOn(false);', '  yellow.setOn(false);', '  green.setOn(false);', '  light.setOn(true);', '}'];

  // One draw() of TrafficLightFlags. Returns the lines that ran, by index.
  function frame(s) {
    var d = [0, 1], h = [];
    s.counter = s.counter + 1;
    if (s.counter >= 180) {
      d.push(2);
      h.push(0, 1);
      if (s.light === 'green') { h.push(2); s.passed = 'yellow'; }
      else { h.push(3); if (s.light === 'yellow') { h.push(4); s.passed = 'red'; } else { h.push(5, 6); s.passed = 'green'; } }
      h.push(10, 11, 12, 13, 14);
      s.light = s.passed;
      d.push(3);
      s.counter = 0;
    }
    d.push(5);
    if (s.light === 'green') { d.push(6); s.speed = 3; }
    else { d.push(7); if (s.light === 'yellow') { d.push(8); s.speed = 1; } else { d.push(9, 10); s.speed = 0; } }
    d.push(12);
    s.x = s.x + s.speed;
    if (s.x > 600) { s.x = -120; s.wrapped = true; }
    d.push(13);
    return { draw: d, helpers: h };
  }

  function buildSteps() {
    var s = { light: 'green', counter: 0, speed: 0, x: 40 };   // after setup(): green.setOn(true)
    var groups = [[1, 1], [2, 179], [180, 180], [181, 359], [360, 360], [361, 539], [540, 540], [541, 541]];
    var text = [
      'The first frame. setup() has already turned green on. The counter goes to 1, so changeLight() is skipped. Green answers true, so the car gets speed 3 and moves from x 40 to 43.',
      'Every one of these frames runs the same lines. The counter climbs to 179, and the car moves 3 a frame, to x 577.',
      'The counter reaches 180. changeLight() asks green, which is on, so turnOn(yellow) turns all three off and yellow on. The counter goes back to 0. Now green answers false and yellow answers true, so the car slows to 1.',
      'Yellow frames: the car creeps 1 a frame. At frame 203 it passes the right edge, and move() wraps it to x -120. By frame 359 it is at x 36.',
      'The counter reaches 180 again. Green is off and yellow is on, so turnOn(red). Now neither green nor yellow is on, so the else branch sets the speed to 0, and move() leaves the car at x 36.',
      'Red frames. The car still gets setSpeed(0) and move() every frame. Adding 0 keeps it where it is.',
      'The counter reaches 180 a third time. Green and yellow are both off, so the else branch in changeLight() runs turnOn(green). Green answers true, so the car gets speed 3 and moves to x 39.',
      'The same lines as frame 1: the loop starts over. The lights repeat every 540 frames, 9 seconds at 60 frames a second. The car does not: it is at x 42, not 43.'
    ];
    var steps = [], f = 0;
    groups.forEach(function (g, i) {
      var ran = null, wrapAt = null;
      for (f = g[0]; f <= g[1]; f++) {
        s.wrapped = false;
        var r = frame(s);
        if (s.wrapped && wrapAt === null) { wrapAt = f; }
        ran = r;   // every frame in a group runs the same lines
      }
      steps.push({ first: g[0], last: g[1], light: s.light, counter: s.counter, speed: s.speed, x: s.x, draw: ran.draw, helpers: ran.helpers, passed: ran.helpers.length ? s.passed : null, wrapAt: wrapAt, text: text[i] });
    });
    return steps;
  }

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

  // Mount one stepper. The Session 3 page mounts itself; the slides mount theirs by hand
  // (data-manual) so they can share the step with the presenter view. Parts marked
  // optional below may be left out of the markup.
  function mount(root, opts) {
    opts = opts || {};
    var $ = function (sel) { return root.querySelector(sel); };
    var set = function (sel, text) { var e = $(sel); if (e) { e.textContent = text; } };
    var steps = buildSteps();
    root.loopSteps = steps;   // read by checks; not used by the page
    var at = 0, timer = null;
    var scene = $('[data-scene]').getContext('2d');
    scene.scale(2, 2);

    function lines(target, source, ran, called) {
      var box = $(target);
      box.textContent = '';
      source.forEach(function (text, i) {
        var span = document.createElement('span');
        var closing = /^\s*}\s*$/.test(text) || text === '';
        span.className = 'lab-line' + (!called ? '' : ran.indexOf(i) > -1 ? ' is-ran' : closing ? '' : ' is-skipped');
        span.textContent = text;
        box.appendChild(span);
      });
    }

    function stop() {
      if (timer) { clearInterval(timer); }
      timer = null;
      set('[data-play]', at === steps.length - 1 ? 'Replay' : 'Play');
    }

    function render() {
      var t = steps[at], many = t.last > t.first;
      set('[data-progress]', (at + 1) + ' / ' + steps.length);
      set('[data-frame]', (many ? 'Frames ' + t.first + '–' + t.last + ' · ' + (t.last - t.first + 1) + ' frames' : 'Frame ' + t.first) + ' · ' + t.light);
      // Frame 540 ends the loop, so it sits at the right-hand end; frame 541 starts again at the left.
      var loopPos = function (f) { return f === 540 ? 100 : (f % 540) / 540 * 100; };
      var marker = $('[data-marker]');
      marker.style.left = loopPos(t.first) + '%';
      marker.style.width = many ? (loopPos(t.last) - loopPos(t.first)) + '%' : '';
      marker.classList.toggle('is-range', many);
      lines('[data-draw]', DRAW, t.draw, true);
      lines('[data-helpers]', HELPERS, t.helpers, t.helpers.length > 0);
      set('[data-helpers-note]', t.helpers.length ? 'called · light → ' + t.passed : 'not called');   // optional
      set('[data-ran-note]', many ? 'every frame' : 'this frame');                                       // optional
      ['red', 'yellow', 'green'].forEach(function (name) { set('[data-value="' + name + '"]', 'on = ' + (t.light === name)); });   // optional
      set('[data-value="car"]', 'x = ' + t.x + ', speed = ' + t.speed);   // optional
      set('[data-counter]', 'counter = ' + t.counter);                   // optional
      set('[data-detail]', t.text);
      paint(scene, t.light, t.x);
      set('[data-picture]', 'End of frame ' + t.last + ': ' + t.light + ' light, car.x = ' + t.x);   // optional
      $('[data-scene]').setAttribute('aria-label', 'End of frame ' + t.last + ': ' + t.light + ' light, blue car at x ' + t.x);
      $('[data-back]').disabled = at === 0;
      $('[data-next]').disabled = at === steps.length - 1;
      if (!timer) { set('[data-play]', at === steps.length - 1 ? 'Replay' : 'Play'); }
    }

    function moved() { if (opts.onStep) { opts.onStep(at); } }
    if (!opts.preview) {
      $('[data-next]').addEventListener('click', function () { stop(); at = Math.min(at + 1, steps.length - 1); render(); moved(); });
      $('[data-back]').addEventListener('click', function () { stop(); at = Math.max(at - 1, 0); render(); moved(); });
      $('[data-play]').addEventListener('click', function () {
        if (timer) { stop(); return; }
        if (at === steps.length - 1) { at = 0; moved(); }
        timer = setInterval(function () { at++; if (at === steps.length - 1) { stop(); } render(); moved(); }, 3000);
        set('[data-play]', 'Pause');
        render();
      });
    }
    render();
    return { go: function (n) { stop(); at = Math.max(0, Math.min(steps.length - 1, n)); render(); }, el: root };
  }

  window.VisibleJavaLoopTrace = mount;
  document.querySelectorAll('[data-loop-trace]').forEach(function (root) {
    if (!root.hasAttribute('data-manual')) { mount(root); }
  });
})();
