/* Step-through demos for the workshop. Each one renders into
   <div class="vj-demo" data-demo="boundary|references|removal"></div>.
   These are teaching models written in JavaScript. They do not run Java. */
(function () {
  var css = document.createElement("style");
  css.textContent = [
    ".vj-demo{background:var(--card,#fff);color:var(--ink,#16211f);border:2px solid var(--outline,#16211f);border-radius:22px;box-shadow:4px 4px 0 var(--outline,#16211f);padding:24px;display:flex;flex-direction:column;gap:16px;max-width:100%}",
    ".vj-demo h3{margin:0}.vj-demo p{margin:0}",
    ".vj-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}",
    ".vj-demo button{font:600 15px/18px var(--font-display,Fredoka,sans-serif);color:#16211f;background:#fff;border:2px solid #16211f;border-radius:999px;box-shadow:2px 2px 0 #16211f;padding:9px 16px;cursor:pointer}",
    ".vj-demo button.go{background:#ffc93c}.vj-demo button[disabled]{opacity:.5;cursor:default}",
    ".vj-code{font:15px/26px var(--font-mono,'Source Code Pro',monospace);background:var(--sunken,#fbeed3);border-radius:14px;padding:12px 16px;margin:0;overflow-x:auto;white-space:pre}",
    ".vj-code .on{background:#ffc93c;color:#16211f;font-weight:600}",
    ".vj-status{font:600 16px/24px var(--font-mono,'Source Code Pro',monospace);min-height:48px}",
    ".vj-track{position:relative;height:110px;background:#fff;border:2px solid #16211f;border-radius:14px;overflow:hidden}",
    ".vj-wall{position:absolute;top:0;bottom:0;background:#ff7f5c}",
    ".vj-ball{position:absolute;top:35px;width:40px;height:40px;margin-left:-20px;border-radius:50%;background:#5fcfaf;border:2px solid #16211f}",
    ".vj-mem{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}",
    ".vj-box{border:2px solid #16211f;border-radius:14px;background:#fff;color:#16211f;padding:10px 16px;font:600 16px/24px var(--font-mono,'Source Code Pro',monospace);min-width:130px}",
    ".vj-box.obj{background:#ece2f8}.vj-box.spare{opacity:.55}",
    ".vj-cells{display:flex;gap:8px;flex-wrap:wrap}",
    ".vj-cell{width:64px;text-align:center;font:600 16px/22px var(--font-mono,'Source Code Pro',monospace);color:#16211f}",
    ".vj-cell b{display:block;border:2px solid #16211f;border-radius:10px;background:#fff;padding:12px 0;margin-top:4px;font-size:20px}",
    ".vj-cell.at b{background:#ffc93c}",
    "body.slide-view{font-size:22px}body.slide-view .vj-demo{max-width:1180px;margin:32px auto;padding:36px;zoom:1.25}",
    "body.slide-view .masthead,body.slide-view .section-nav,body.slide-view footer,body.slide-view .hide-in-slide,body.slide-view .skip-link{display:none}"
  ].join("");
  document.head.appendChild(css);

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) { n.className = cls; } if (text !== undefined) { n.textContent = text; } return n; }
  function shell(root, title, question) {
    root.appendChild(el("h3", "", title));
    root.appendChild(el("p", "", question));
    var stage = el("div"), status = el("p", "vj-status"), row = el("div", "vj-row");
    status.setAttribute("aria-live", "polite");
    root.appendChild(stage); root.appendChild(status); root.appendChild(row);
    return { stage: stage, status: status, row: row };
  }
  function button(row, label, go, fn) { var b = el("button", go ? "go" : "", label); b.type = "button"; b.addEventListener("click", fn); row.appendChild(b); return b; }
  function code(lines, on) {
    var pre = el("pre", "vj-code");
    lines.forEach(function (line, i) { var s = el("span", i === on ? "on" : "", line); pre.appendChild(s); pre.appendChild(document.createTextNode("\n")); });
    return pre;
  }

  function boundary(root) {
    var ui = shell(root, "Which frame turns the ball around?", "The wall is at 380, and the ball moves 20 each frame. Predict the turn for each condition.");
    var inclusive = false, x, speed, frame, turned;
    function reset() { x = 320; speed = 20; frame = 0; turned = null; paint(); }
    function test() { return inclusive ? x >= 380 : x > 380; }
    function paint() {
      ui.stage.innerHTML = "";
      var track = el("div", "vj-track"), wall = el("div", "vj-wall"), ball = el("div", "vj-ball");
      wall.style.left = (380 / 420 * 100) + "%"; wall.style.right = "0"; ball.style.left = (x / 420 * 100) + "%";
      track.appendChild(wall); track.appendChild(ball); ui.stage.appendChild(track);
      ui.stage.appendChild(code(["x = x + speed;", "if (" + (inclusive ? "x >= 380" : "x > 380") + ") {", "  speed = -speed;", "}"], -1));
      ui.status.textContent = "frame " + frame + ": x = " + x + ", " + (inclusive ? "x >= 380" : "x > 380") + " is " + test() + (turned !== null ? " · turned at frame " + turned : "");
    }
    button(ui.row, "Next frame", true, function () { if (frame < 8) { x += speed; frame++; if (test() && speed > 0) { speed = -speed; turned = frame; } paint(); } });
    button(ui.row, "Switch > and >=", false, function () { inclusive = !inclusive; reset(); });
    button(ui.row, "Reset", false, reset);
    reset();
  }

  var REF = [
    ["Ball a = new Ball(100);", function (m) { m.objects = [100]; m.a = 0; }, "One object. a refers to it."],
    ["Ball b = a;", function (m) { m.b = 0; }, "No new object. b refers to the same one."],
    ["b.move();", function (m) { m.objects[m.b] += 50; }, "The object moves. Both variables see it."],
    ["System.out.println(a.getX());", function (m) { m.out.push(m.objects[m.a]); }, "Prints through a."],
    ["b = new Ball(300);", function (m) { m.objects.push(300); m.b = 1; }, "Now there are two objects."],
    ["b.move();", function (m) { m.objects[m.b] += 50; }, "Only b's object moves."],
    ["System.out.println(a.getX());", function (m) { m.out.push(m.objects[m.a]); }, "a still refers to the first object."]
  ];
  function references(root) {
    var ui = shell(root, "Two variables, how many objects?", "Predict both printed values before you step. move() adds 50 to x.");
    var at, m;
    function reset() { at = -1; m = { objects: [], a: null, b: null, out: [] }; paint(); }
    function paint() {
      ui.stage.innerHTML = "";
      ui.stage.appendChild(code(REF.map(function (r) { return r[0]; }), at));
      var mem = el("div", "vj-mem"); mem.style.marginTop = "16px";
      var vars = el("div"); vars.appendChild(el("p", "", "Variables"));
      ["a", "b"].forEach(function (v) { if (m[v] !== null) { vars.appendChild(el("div", "vj-box", v + " → object " + (m[v] + 1))); } });
      var objs = el("div"); objs.appendChild(el("p", "", "Objects"));
      m.objects.forEach(function (x, i) { var names = ["a", "b"].filter(function (v) { return m[v] === i; }).join(" and "); objs.appendChild(el("div", "vj-box obj", "object " + (i + 1) + ": x = " + x + (names ? " (" + names + ")" : ""))); });
      mem.appendChild(vars); mem.appendChild(objs); ui.stage.appendChild(mem);
      ui.status.textContent = (at < 0 ? "Ready." : REF[at][2]) + (m.out.length ? " Printed: " + m.out.join(", ") : "");
    }
    button(ui.row, "Step", true, function () { if (at < REF.length - 1) { at++; REF[at][1](m); paint(); } });
    button(ui.row, "Reset", false, reset);
    reset();
  }

  function removal(root) {
    var ui = shell(root, "Why does a zero survive?", "Remove every 0. Predict the final list for each direction before you step.");
    var backward = false, list, i, done, note;
    function reset() { list = [3, 0, 0, 5, 0]; i = backward ? list.length - 1 : 0; done = false; note = "Ready."; paint(); }
    function paint() {
      ui.stage.innerHTML = "";
      ui.stage.appendChild(code(backward ? ["for (int i = list.size() - 1; i >= 0; i--) {", "  if (list.get(i) == 0) {", "    list.remove(i);", "  }", "}"] : ["for (int i = 0; i < list.size(); i++) {", "  if (list.get(i) == 0) {", "    list.remove(i);", "  }", "}"], -1));
      var cells = el("div", "vj-cells"); cells.style.marginTop = "16px";
      list.forEach(function (v, n) { var c = el("div", "vj-cell" + (n === i && !done ? " at" : ""), n === i && !done ? "i = " + n : String(n)); c.appendChild(el("b", "", String(v))); cells.appendChild(c); });
      ui.stage.appendChild(cells);
      ui.status.textContent = note + " size = " + list.length;
    }
    function step() {
      if (done) { return; }
      var removed = list[i] === 0;
      if (removed) { list.splice(i, 1); note = backward ? "Removed at " + i + "." : "Removed at " + i + ". Later values slid left, and i++ will pass the one now at " + i + "."; }
      else { note = "Kept " + list[i] + " at " + i + "."; }
      i += backward ? -1 : 1;
      if (backward ? i < 0 : i >= list.length) { done = true; note += " Done: [" + list.join(", ") + "]."; }
      paint();
    }
    button(ui.row, "Step", true, step);
    button(ui.row, "Switch direction", false, function () { backward = !backward; reset(); });
    button(ui.row, "Reset", false, reset);
    reset();
  }

  var DEMOS = { boundary: boundary, references: references, removal: removal };
  var params = new URLSearchParams(location.search);
  var only = params.get("demo");
  if (params.get("view") === "slide") { document.body.classList.add("slide-view"); }
  document.querySelectorAll(".vj-demo").forEach(function (root) {
    var name = root.dataset.demo;
    if (only && name !== only) { var part = root.closest("section"); if (part) { part.hidden = true; } return; }
    if (DEMOS[name]) { DEMOS[name](root); }
  });
})();
