/* Loop lab: nested loops made visible.
   A small parser reads the counts people type (row, ROWS, x, whole numbers,
   + - * / %, Math.min/max/abs) with Java's int arithmetic. Nothing typed here
   is run as code. */
(() => {
  "use strict";

  /* ---------- expressions ---------- */
  const FUNCS = { "Math.min": [2, Math.min], "Math.max": [2, Math.max], "Math.abs": [1, Math.abs] };

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i += 1; continue; }
      if (/[0-9]/.test(ch)) {
        let j = i;
        while (j < src.length && /[0-9]/.test(src[j])) j += 1;
        tokens.push({ t: "num", v: Number(src.slice(i, j)) });
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        let j = i;
        while (j < src.length && /[A-Za-z0-9_.]/.test(src[j])) j += 1;
        tokens.push({ t: "id", v: src.slice(i, j) });
        i = j;
        continue;
      }
      if ("+-*/%(),".includes(ch)) { tokens.push({ t: "op", v: ch }); i += 1; continue; }
      throw new Error(`“${ch}” isn’t allowed here.`);
    }
    return tokens;
  }

  function compile(src, names) {
    if (!String(src).trim()) throw new Error("Write an expression, like row or 0.");
    const tokens = tokenize(String(src));
    let p = 0;
    const peek = () => tokens[p];
    const isOp = (v) => peek() && peek().t === "op" && peek().v === v;
    const take = (v) => {
      const tk = tokens[p];
      if (!tk) throw new Error("The expression ends too soon.");
      if (v && tk.v !== v) throw new Error(`Expected “${v}” before “${tk.v}”.`);
      p += 1;
      return tk;
    };

    function expr() {
      let node = term();
      while (isOp("+") || isOp("-")) {
        const op = take().v;
        const left = node, right = term();
        node = op === "+" ? (env) => left(env) + right(env) : (env) => left(env) - right(env);
      }
      return node;
    }
    function term() {
      let node = unary();
      while (isOp("*") || isOp("/") || isOp("%")) {
        const op = take().v;
        const left = node, right = unary();
        if (op === "*") node = (env) => left(env) * right(env);
        else node = (env) => {
          const d = right(env);
          if (d === 0) throw new Error("That divides by zero.");
          const n = left(env);
          return op === "/" ? Math.trunc(n / d) : n % d;
        };
      }
      return node;
    }
    function unary() {
      if (isOp("-")) { take(); const inner = unary(); return (env) => -inner(env); }
      if (isOp("+")) { take(); return unary(); }
      return primary();
    }
    function primary() {
      const tk = peek();
      if (!tk) throw new Error("The expression ends too soon.");
      if (tk.t === "num") { take(); return () => tk.v; }
      if (tk.t === "id") {
        take();
        if (FUNCS[tk.v]) {
          const [arity, fn] = FUNCS[tk.v];
          take("(");
          const args = [expr()];
          while (isOp(",")) { take(); args.push(expr()); }
          take(")");
          if (args.length !== arity) throw new Error(`${tk.v} takes ${arity === 1 ? "one value" : "two values"}.`);
          return (env) => fn(...args.map((a) => a(env)));
        }
        if (names.includes(tk.v)) return (env) => env[tk.v];
        const options = names.length ? names.join(" or ") : "whole numbers";
        throw new Error(`“${tk.v}” isn’t defined here. Use ${options}.`);
      }
      if (isOp("(")) { take(); const node = expr(); take(")"); return node; }
      throw new Error(`Unexpected “${tk.v}”.`);
    }

    const node = expr();
    if (p < tokens.length) throw new Error(`Unexpected “${tokens[p].v}”.`);
    return node;
  }

  const plural = (n, one, many) => `${n.toLocaleString()} ${n === 1 ? one : many}`;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 01 · Pattern lab ---------- */
  const lab = document.querySelector("[data-pattern-lab]");
  if (lab) {
    const MAX_WIDTH = 40;
    const TARGETS = {
      staircase: (r) => [0, r],
      upside: (r, n) => [0, n - r + 1],
      right: (r, n) => [n - r, r],
      rightDown: (r, n) => [r - 1, n - r + 1],
      pyramid: (r, n) => [n - r, 2 * r - 1],
      diamond: (r, n) => { const m = Math.min(r, n - r + 1); return [Math.trunc((n + 1) / 2) - m, 2 * m - 1]; }
    };
    const ui = {
      target: lab.querySelector("[data-target]"),
      rows: lab.querySelector("[data-rows]"),
      spaces: lab.querySelector("[data-spaces]"),
      stars: lab.querySelector("[data-stars]"),
      error: lab.querySelector("[data-error]"),
      dots: lab.querySelector("[data-dots]"),
      code: lab.querySelector("[data-code]"),
      run: lab.querySelector("[data-run]"),
      step: lab.querySelector("[data-step]"),
      finish: lab.querySelector("[data-finish-row]"),
      reset: lab.querySelector("[data-reset]"),
      trace: lab.querySelector("[data-trace]"),
      output: lab.querySelector("[data-output]"),
      verdict: lab.querySelector("[data-verdict]"),
      countsWrap: lab.querySelector("[data-counts-wrap]"),
      counts: lab.querySelector("[data-counts]"),
      passTable: lab.querySelector("[data-pass-table]")
    };
    let plan = null;     // { n, rows: [{spaces, stars, rawSpaces, rawStars, begin, starsAt}], events, target }
    let cursor = 0;      // events already printed
    let timer = null;
    let passRows = [];   // trace table cells, one entry per pass plus the final check
    const guesses = { s: {}, k: {} };  // predictions typed into the trace table, by row

    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    function build() {
      stop();
      const n = Number(ui.rows.value);
      const target = ui.target.value;
      try {
        if (!Number.isInteger(n) || n < 1 || n > 12) throw new Error("Rows must be a whole number from 1 to 12.");
        const spacesFn = compile(ui.spaces.value, ["row", "ROWS"]);
        const starsFn = compile(ui.stars.value, ["row", "ROWS"]);
        const rows = [];
        const events = [];
        for (let r = 1; r <= n; r += 1) {
          const env = { row: r, ROWS: n };
          const rawSpaces = spacesFn(env), rawStars = starsFn(env);
          const spaces = Math.max(0, rawSpaces), stars = Math.max(0, rawStars);
          if (spaces + stars > MAX_WIDTH) throw new Error(`Row ${r} would be ${spaces + stars} characters wide. Keep each row to ${MAX_WIDTH} or fewer.`);
          /* begin: this row's first print. starsAt: the print that shows the star loop has started. */
          const begin = events.length;
          for (let s = 1; s <= spaces; s += 1) events.push({ kind: "space", row: r, i: s, of: spaces });
          const starsAt = events.length;
          for (let k = 1; k <= stars; k += 1) events.push({ kind: "star", row: r, i: k, of: stars });
          events.push({ kind: "newline", row: r });
          rows.push({ spaces, stars, rawSpaces, rawStars, begin, starsAt });
        }
        plan = { n, rows, events, target };
        ui.error.hidden = true;
      } catch (err) {
        plan = null;
        ui.error.textContent = err.message;
        ui.error.hidden = false;
      }
      cursor = 0;
      renderCode();
      renderCounts();
      buildPassTable();
      render();
    }

    /* The Java source, with the person's expressions dropped in. */
    function renderCode() {
      const n = Number(ui.rows.value) || 0;
      const lines = [
        [["k", "final int"], ["", " ROWS = "], ["l", String(n)], ["", ";"]],
        [],
        [["k", "for"], ["", " ("], ["k", "int"], ["", " row = "], ["l", "1"], ["", "; row <= ROWS; row++) {"]],
        [["", "    "], ["k", "for"], ["", " ("], ["k", "int"], ["", " space = "], ["l", "1"], ["", "; space <= "], ["x", ui.spaces.value.trim() || "?"], ["", "; space++) {"]],
        [["", "        System.out."], ["f", "print"], ["", "("], ["l", "\" \""], ["", ");"]],
        [["", "    }"]],
        [["", "    "], ["k", "for"], ["", " ("], ["k", "int"], ["", " star = "], ["l", "1"], ["", "; star <= "], ["x", ui.stars.value.trim() || "?"], ["", "; star++) {"]],
        [["", "        System.out."], ["f", "print"], ["", "("], ["l", "\"*\""], ["", ");"]],
        [["", "    }"]],
        [["", "    System.out."], ["f", "println"], ["", "();"]],
        [["", "}"]]
      ];
      const classes = { k: "syn-k", l: "syn-l", f: "syn-f", x: "lab-expr" };
      ui.code.replaceChildren(...lines.map((parts) => {
        const line = el("span", "lab-line");
        if (!parts.length) line.textContent = " ";
        parts.forEach(([kind, text]) => line.append(kind ? el("span", classes[kind], text) : document.createTextNode(text)));
        return line;
      }));
    }

    function targetCounts(r) {
      const fn = TARGETS[plan ? plan.target : ui.target.value];
      return fn ? fn(r, plan ? plan.n : Number(ui.rows.value)) : null;
    }

    function renderCounts() {
      const fn = TARGETS[ui.target.value];
      const n = Number(ui.rows.value);
      ui.countsWrap.hidden = !fn || !Number.isInteger(n) || n < 1 || n > 12;
      if (ui.countsWrap.hidden) return;
      const head = el("tr");
      ["row", "spaces", "stars"].forEach((h) => head.append(el("th", null, h)));
      const body = [];
      for (let r = 1; r <= n; r += 1) {
        const [s, k] = fn(r, n);
        const tr = el("tr");
        [r, s, k].forEach((v) => tr.append(el("td", null, String(v))));
        body.push(tr);
      }
      const thead = el("thead"); thead.append(head);
      const tbody = el("tbody"); tbody.append(...body);
      ui.counts.replaceChildren(thead, tbody);
    }

    /* Trace table: a row per check of row <= ROWS. Each count stays a blank to predict
       until its inner loop starts, then shows the value the expression gave. */
    function buildPassTable() {
      passRows = [];
      if (!plan) { ui.passTable.replaceChildren(); return; }
      const caption = el("caption", "sr-only", "Trace table: one row per pass of the outer loop");
      const head = el("tr");
      head.append(el("th", null, "row"), el("th", null, "row <= ROWS"));
      [["spaces", ui.spaces.value], ["stars", ui.stars.value]].forEach(([label, expr]) => {
        const th = el("th", null, label);
        th.append(el("code", "trace-expr", expr.trim()));
        head.append(th);
      });
      const thead = el("thead"); thead.append(head);
      const tbody = el("tbody");
      for (let r = 1; r <= plan.n + 1; r += 1) {
        const tr = el("tr");
        tr.append(el("th", null, String(r)));
        const cond = el("td");
        tr.append(cond);
        if (r > plan.n) {
          const end = el("td", "trace-end");
          end.colSpan = 2;
          tr.append(end);
          passRows.push({ tr, cond, end });
        } else {
          const sp = el("td"), st = el("td");
          tr.append(sp, st);
          passRows.push({ tr, cond, sp, st });
        }
        tbody.append(tr);
      }
      ui.passTable.replaceChildren(caption, thead, tbody);
    }

    /* Only touch a cell when what it shows changes, so a half-typed prediction keeps focus. */
    function setCell(cell, state, fill) {
      if (cell.dataset.state === state) return;
      cell.dataset.state = state;
      fill();
    }

    function countCell(cell, r, key, raw, count) {
      const label = key === "s" ? "spaces" : "stars";
      if (raw === null) {
        setCell(cell, "blank", () => {
          cell.className = "trace-blank";
          const input = el("input", "trace-guess");
          input.type = "text";
          input.inputMode = "numeric";
          input.autocomplete = "off";
          input.spellcheck = false;
          input.value = guesses[key][r] || "";
          input.setAttribute("aria-label", `Predict ${label} for row ${r}`);
          input.addEventListener("input", () => { guesses[key][r] = input.value.trim(); });
          cell.replaceChildren(input);
        });
        return;
      }
      const guess = guesses[key][r] || "";
      setCell(cell, `${raw}|${guess}`, () => {
        cell.className = "";
        const parts = [el("span", raw < 0 ? "trace-none" : null, String(raw))];
        if (raw < 0) parts.push(el("span", "trace-note", ` (runs ${count} times)`));
        if (guess) {
          const ok = Number(guess) === raw || Number(guess) === count;
          parts.push(ok ? el("span", "trace-ok", " ✓") : el("span", "trace-miss", ` you said ${guess}`));
          if (ok) parts[parts.length - 1].append(el("span", "sr-only", " matches your prediction"));
        }
        cell.replaceChildren(...parts);
      });
    }

    function renderPassTable(nowRow) {
      if (!plan) return;
      const finished = cursor >= plan.events.length;
      passRows.forEach((ref, idx) => {
        const r = idx + 1;
        ref.tr.classList.toggle("is-now", r === nowRow);
        if (ref.end) {
          setCell(ref.cond, finished ? "false" : "", () => {
            ref.cond.className = finished ? "trace-false" : "";
            ref.cond.textContent = finished ? "false" : "";
          });
          setCell(ref.end, finished ? "end" : "", () => { ref.end.textContent = finished ? "the loop ends" : ""; });
          return;
        }
        const row = plan.rows[idx];
        const started = cursor > row.begin;
        setCell(ref.cond, started ? "true" : "", () => {
          ref.cond.className = started ? "trace-true" : "";
          ref.cond.textContent = started ? "true" : "";
        });
        countCell(ref.sp, r, "s", started ? row.rawSpaces : null, row.spaces);
        countCell(ref.st, r, "k", cursor > row.starsAt ? row.rawStars : null, row.stars);
      });
    }

    function segment(spaces, stars, dots) {
      const frag = document.createDocumentFragment();
      if (spaces) frag.append(el("span", "lab-sp", (dots ? "·" : " ").repeat(spaces)));
      if (stars) frag.append(el("span", "lab-st", "*".repeat(stars)));
      return frag;
    }

    function render() {
      const dots = ui.dots.checked;
      const hasTarget = Boolean(plan && TARGETS[plan.target]);
      [ui.run, ui.step, ui.finish, ui.reset].forEach((b) => { b.disabled = !plan; });
      ui.output.classList.toggle("has-target", hasTarget);
      if (!plan) {
        ui.output.replaceChildren(el("p", "lab-empty", "Fix the expression above to see the output."));
        ui.trace.textContent = "";
        ui.verdict.textContent = "";
        markLine(-1);
        return;
      }

      /* What has printed so far, row by row. */
      const printed = plan.rows.map(() => ({ spaces: 0, stars: 0, done: false }));
      for (let e = 0; e < cursor; e += 1) {
        const ev = plan.events[e];
        const slot = printed[ev.row - 1];
        if (ev.kind === "space") slot.spaces += 1;
        else if (ev.kind === "star") slot.stars += 1;
        else slot.done = true;
      }
      const activeRow = cursor < plan.events.length ? plan.events[cursor].row : null;

      const cells = [];
      ["row", hasTarget ? "target" : null, "your output", hasTarget ? "" : null].forEach((h) => {
        if (h !== null) cells.push(el("span", "lab-head", h));
      });
      let matches = 0;
      let firstMiss = null;
      plan.rows.forEach((row, idx) => {
        const r = idx + 1;
        const got = printed[idx];
        cells.push(el("span", "lab-rownum", String(r)));
        if (hasTarget) {
          const [ts, tk] = targetCounts(r);
          const t = el("span", "lab-target");
          t.append(segment(Math.max(0, ts), Math.max(0, tk), dots));
          cells.push(t);
        }
        const mine = el("span", "lab-mine");
        mine.append(segment(got.spaces, got.stars, dots));
        if (r === activeRow && cursor > 0) mine.append(el("span", "lab-caret", "▌"));
        cells.push(mine);
        if (hasTarget) {
          const [ts, tk] = targetCounts(r).map((v) => Math.max(0, v));
          const mark = el("span", "lab-mark");
          if (got.done) {
            const ok = got.spaces === ts && got.stars === tk;
            if (ok) matches += 1; else if (!firstMiss) firstMiss = { r, ts, tk, ys: got.spaces, yk: got.stars };
            mark.classList.add(ok ? "ok" : "off");
            mark.textContent = ok ? "✓" : "✗";
            mark.title = ok ? "matches" : "doesn’t match";
            mark.append(el("span", "sr-only", ok ? " matches" : " doesn’t match"));
          }
          cells.push(mark);
        }
      });
      ui.output.replaceChildren(...cells);

      /* Trace line and code highlight for the last print. */
      const last = cursor > 0 ? plan.events[cursor - 1] : null;
      renderPassTable(!last ? null : cursor >= plan.events.length ? plan.n + 1 : last.row);
      const totals = printed.reduce((a, p) => ({ s: a.s + p.spaces, k: a.k + p.stars, n: a.n + (p.done ? 1 : 0) }), { s: 0, k: 0, n: 0 });
      if (!last) {
        ui.trace.textContent = "Ready. Predict the first row, then step through it.";
        markLine(-1);
      } else {
        let what;
        if (last.kind === "space") { what = `row = ${last.row} · space = ${last.i} of ${last.of} → printed a space`; markLine(4); }
        else if (last.kind === "star") { what = `row = ${last.row} · star = ${last.i} of ${last.of} → printed *`; markLine(7); }
        else { what = `row = ${last.row} is done → println() starts a new line`; markLine(9); }
        const raw = plan.rows[last.row - 1];
        const skipped = [];
        if (raw.rawSpaces < 0) skipped.push(`spaces is ${raw.rawSpaces}, so that loop doesn’t run`);
        if (raw.rawStars < 0) skipped.push(`stars is ${raw.rawStars}, so that loop doesn’t run`);
        ui.trace.textContent = `${what}. So far: ${plural(totals.s, "space", "spaces")}, ${plural(totals.k, "star", "stars")}, ${plural(totals.n, "line", "lines")}.${skipped.length ? " (" + skipped.join("; ") + ".)" : ""}`;
      }

      /* Verdict once everything has printed. */
      if (cursor < plan.events.length) {
        ui.verdict.textContent = "";
      } else if (!hasTarget) {
        ui.verdict.textContent = `Done: ${plural(plan.n, "row", "rows")}, ${plural(totals.k, "star", "stars")} and ${plural(totals.s, "space", "spaces")}, in ${plural(plan.events.length, "print", "prints")}.`;
      } else if (matches === plan.n) {
        ui.verdict.textContent = `All ${plan.n} rows match the target. You built it!`;
      } else {
        const m = firstMiss;
        ui.verdict.textContent = `${matches} of ${plan.n} rows match. Row ${m.r} needs ${plural(m.ts, "space", "spaces")} and ${plural(m.tk, "star", "stars")}; yours has ${m.ys} and ${m.yk}.`;
      }
    }

    function markLine(index) {
      [...ui.code.children].forEach((line, i) => line.classList.toggle("is-active", i === index));
    }

    function advance(steps) {
      if (!plan) return;
      if (cursor >= plan.events.length) cursor = 0;
      cursor = Math.min(plan.events.length, cursor + steps);
      render();
    }

    ui.step.addEventListener("click", () => { stop(); advance(1); });
    ui.finish.addEventListener("click", () => {
      stop();
      if (!plan) return;
      if (cursor >= plan.events.length) cursor = 0;
      let next = cursor;
      while (next < plan.events.length && plan.events[next].kind !== "newline") next += 1;
      cursor = Math.min(plan.events.length, next + 1);
      render();
    });
    ui.reset.addEventListener("click", () => { stop(); cursor = 0; render(); });
    ui.run.addEventListener("click", () => {
      stop();
      if (!plan) return;
      if (cursor >= plan.events.length) cursor = 0;
      if (reducedMotion()) { cursor = plan.events.length; render(); return; }
      const delay = Math.max(8, Math.min(60, Math.round(1800 / plan.events.length)));
      timer = setInterval(() => {
        cursor += 1;
        render();
        if (cursor >= plan.events.length) stop();
      }, delay);
    });
    [ui.target, ui.rows, ui.spaces, ui.stars].forEach((input) => input.addEventListener("input", build));
    ui.dots.addEventListener("change", render);
    build();
  }

  /* ---------- 02 · Count the work ---------- */
  const counter = document.querySelector("[data-count-lab]");
  if (counter) {
    const MAX_PASSES = 10000;
    const MAX_STEPS = 10000;    // runs of one multiplying or dividing loop
    const MAX_WORK = 2000000;   // loop steps stepped through for one count
    const SHOW_ROWS = 30;
    const SHOW_DOTS = 50;
    const COMPARE = {
      "<": (v, b) => v < b, "<=": (v, b) => v <= b, ">": (v, b) => v > b, ">=": (v, b) => v >= b, "!=": (v, b) => v !== b
    };
    const PRESETS = {
      grid: ["1", "<=", "50", "x++", "1", "<=", "20", "y++"],
      triangle: ["1", "<=", "10", "x++", "1", "<=", "x", "y++"],
      shrinking: ["1", "<=", "4", "x++", "x", "<=", "4", "y++"],
      zero: ["0", "<", "10", "x++", "0", "<", "x", "y++"],
      down: ["10", ">", "0", "x--", "1", "<=", "x", "y++"],
      doubling: ["1", "<", "100", "x *= 2", "1", "<=", "3", "y++"],
      skips: ["0", "!=", "10", "x += 3", "1", "<=", "2", "y++"]
    };
    const ui = {
      a: counter.querySelector("[data-a]"),
      opA: counter.querySelector("[data-op-a]"),
      b: counter.querySelector("[data-b]"),
      stepA: counter.querySelector("[data-step-a]"),
      c: counter.querySelector("[data-c]"),
      opC: counter.querySelector("[data-op-c]"),
      d: counter.querySelector("[data-d]"),
      stepC: counter.querySelector("[data-step-c]"),
      error: counter.querySelector("[data-count-error]"),
      guess: counter.querySelector("[data-guess]"),
      never: counter.querySelector("[data-never]"),
      guessError: counter.querySelector("[data-guess-error]"),
      check: counter.querySelector("[data-check]"),
      show: counter.querySelector("[data-show]"),
      result: counter.querySelector("[data-result]"),
      field: counter.querySelector("[data-dots-field]")
    };
    const fields = [ui.a, ui.opA, ui.b, ui.stepA, ui.c, ui.opC, ui.d, ui.stepC];
    let model = null;

    /* A for-loop update (x++, x--, x += 2, x = x * 2 …) as { kind, by, text }.
       kind is add, mul or div; by gives the amount, and may use x in the inner loop. */
    function parseUpdate(src, v, names) {
      const s = String(src).trim().replace(/;\s*$/, "").trim();
      if (!s) throw new Error(`Write an update for ${v}, like ${v}++.`);
      const named = (name, step) => {
        if (name !== v) throw new Error(`This update has to change ${v}, not ${name}.`);
        return { ...step, text: s };
      };
      const step = (op, fn) => (op === "+" ? { kind: "add", by: fn }
        : op === "-" ? { kind: "add", by: (env) => -fn(env) }
        : op === "*" ? { kind: "mul", by: fn }
        : { kind: "div", by: fn });
      let m = s.match(/^([A-Za-z_]\w*)\s*(\+\+|--)$/) || s.match(/^(\+\+|--)\s*([A-Za-z_]\w*)$/);
      if (m) {
        const prefix = m[1] === "++" || m[1] === "--";
        const up = (prefix ? m[1] : m[2]) === "++";
        return named(prefix ? m[2] : m[1], { kind: "add", by: () => (up ? 1 : -1) });
      }
      m = s.match(/^([A-Za-z_]\w*)\s*([-+*/])=\s*(.+)$/);
      if (m) return named(m[1], step(m[2], compile(m[3], names)));
      m = s.match(/^([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)\s*([-+*/])\s*(.+)$/);
      if (m && m[1] === m[2]) return named(m[1], step(m[3], compile(m[4], names)));
      throw new Error(`Write the update like ${v}++, ${v} += 2 or ${v} *= 2.`);
    }

    const next = (v, kind, by) => (kind === "add" ? (v + by) | 0 : kind === "mul" ? Math.imul(v, by) : Math.trunc(v / by) | 0);

    /* How many times one loop runs: for (v = start; v OP bound; update), with Java's int rules.
       Adding loops are counted with arithmetic; multiplying and dividing ones are stepped,
       watching for a value that repeats (then the loop can never stop). */
    function runs(start, op, bound, kind, by, work) {
      const test = COMPARE[op];
      if (!test(start, bound)) return { count: 0, first: start, last: start, end: start };
      if (kind === "div" && by === 0) throw new Error("That update divides by zero. Java would stop with an ArithmeticException.");
      if (kind === "add") {
        if (by === 0) return { forever: "stuck", at: start };
        let count;
        if (op === "<" || op === "<=") {
          if (by < 0) return { forever: "away" };
          count = Math.floor(((op === "<=" ? bound : bound - 1) - start) / by) + 1;
        } else if (op === ">" || op === ">=") {
          if (by > 0) return { forever: "away" };
          count = Math.floor((start - (op === ">=" ? bound : bound + 1)) / -by) + 1;
        } else {
          const gap = bound - start;
          if (gap % by !== 0 || gap / by < 0) return { forever: "skips", seq: [0, 1, 2, 3].map((i) => start + i * by) };
          count = gap / by;
        }
        return { count, first: start, last: start + (count - 1) * by, end: start + count * by };
      }
      const seen = new Set();
      let v = start, last = start;
      while (test(v, bound)) {
        if (seen.has(v)) return { forever: v === last ? "stuck" : "cycle", at: v, seq: [...seen].slice(0, 4) };
        if (seen.size >= MAX_STEPS) return { forever: "long" };
        work.steps += 1;
        if (work.steps > MAX_WORK) throw new Error("That’s more work than this lab will step through. Try smaller numbers.");
        seen.add(v);
        last = v;
        v = next(v, kind, by);
      }
      return { count: seen.size, first: start, last, end: v };
    }

    /* Both loops: each pass of the outer loop, and how many times the inner body runs on it.
       A loop that never stops still gets its first passes, so there is something to draw. */
    function simulate(spec) {
      const { outer, inner } = spec;
      const work = { steps: 0 };
      const byA = outer.step.by({});
      const head = runs(outer.start, outer.op, outer.bound, outer.step.kind, byA, work);
      const limit = head.forever ? SHOW_ROWS : head.count;
      if (limit > MAX_PASSES) throw new Error(`That outer loop runs ${limit.toLocaleString()} times. Keep it to ${MAX_PASSES.toLocaleString()} or fewer.`);
      const passes = [];
      let x = outer.start;
      for (let i = 0; i < limit && COMPARE[outer.op](x, outer.bound); i += 1) {
        const env = { x };
        const lo = inner.startFn(env), hi = inner.boundFn(env);
        const run = runs(lo, inner.op, hi, inner.step.kind, inner.step.by(env), work);
        if (run.forever) return { passes, forever: { ...run, loop: "inner", x, start: lo, bound: hi } };
        passes.push({ x, count: run.count, first: run.first, last: run.last, end: run.end, bound: hi });
        x = next(x, outer.step.kind, byA);
      }
      if (head.forever) return { passes, forever: { ...head, loop: "outer", start: outer.start, bound: outer.bound } };
      return { passes, total: passes.reduce((sum, p) => sum + p.count, 0), end: head.end };
    }

    function compute() {
      try {
        const spec = {
          outer: {
            start: compile(ui.a.value, [])({}),
            op: ui.opA.value,
            bound: compile(ui.b.value, [])({}),
            step: parseUpdate(ui.stepA.value, "x", [])
          },
          inner: {
            startFn: compile(ui.c.value, ["x"]),
            op: ui.opC.value,
            boundFn: compile(ui.d.value, ["x"]),
            step: parseUpdate(ui.stepC.value, "y", ["x"])
          }
        };
        model = { spec, ...simulate(spec) };
        ui.error.hidden = true;
      } catch (err) {
        model = null;
        ui.error.textContent = err.message;
        ui.error.hidden = false;
      }
      ui.check.disabled = ui.show.disabled = !model;
      ui.result.replaceChildren();
      ui.field.hidden = true;
    }

    /* Why a loop never stops, using the values it actually takes. */
    function whyForever(f) {
      const outer = f.loop === "outer";
      const v = outer ? "x" : "y";
      const { op, step } = outer ? model.spec.outer : model.spec.inner;
      const cond = `${v} ${op} ${f.bound}`;
      const where = outer ? "" : `On the pass where x = ${f.x}, `;
      let why;
      if (f.forever === "away") why = `${v} starts at ${f.start} and ${step.text} moves it away from ${f.bound}, so ${cond} stays true.`;
      else if (f.forever === "skips") why = `${v} goes ${f.seq.join(", ")}, … and never equals ${f.bound}, so ${cond} stays true.`;
      else if (f.forever === "stuck") why = `${v} reaches ${f.at}, and ${step.text} leaves it at ${f.at}, so ${cond} stays true.`;
      else if (f.forever === "cycle") why = `${v} keeps cycling through ${f.seq.join(", ")}, …, so ${cond} stays true.`;
      else why = `${cond} is still true after ${MAX_STEPS.toLocaleString()} runs, so as far as this lab can tell it never stops.`;
      const strictly = f.forever === "away" || f.forever === "skips"
        ? " (Strictly, Java’s int would eventually overflow and wrap around, which could end it hundreds of millions of passes later. Treat it as an infinite loop.)" : "";
      return `${where}${why} The ${outer ? "outer" : "inner"} loop never stops.${strictly}`;
    }

    function explain() {
      const { passes, total, forever, spec } = model;
      if (forever) return whyForever(forever);
      if (!passes.length) return `x starts at ${spec.outer.start}, and ${spec.outer.start} ${spec.outer.op} ${spec.outer.bound} is false, so neither loop body runs.`;
      const same = passes.every((p) => p.count === passes[0].count);
      if (same) {
        return `${plural(passes.length, "pass", "passes")} of the outer loop × ${plural(passes[0].count, "run", "runs")} of the inner loop each = ${total.toLocaleString()}.`;
      }
      const counts = passes.map((p) => p.count);
      const shown = counts.length <= 7 ? counts.join(" + ") : `${counts.slice(0, 4).join(" + ")} + … + ${counts.slice(-2).join(" + ")}`;
      return `The inner loop runs a different number of times on each pass: ${shown} = ${total.toLocaleString()}.`;
    }

    /* The first few values a loop variable takes, for messages. */
    function values(start, op, bound, kind, by) {
      const out = [];
      let v = start;
      while (out.length < 4 && COMPARE[op](v, bound)) { out.push(v); v = next(v, kind, by); }
      return out.join(", ") + (COMPARE[op](v, bound) ? ", …" : "");
    }

    /* A wrong count usually matches a common slip. Return the first slip that gives this guess. */
    function diagnose(guess) {
      const { passes, total, spec, end } = model;
      const P = passes.length;
      if (!P) return null;
      const { outer, inner } = spec;
      const counts = passes.map((p) => p.count);
      const same = counts.every((c) => c === counts[0]);
      const first = passes[0], last = passes[P - 1];
      const sample = passes.find((p) => p.count > 0);
      const slips = [];
      const slip = (value, text) => { if (value !== total) slips.push([value, text]); };

      slip(P, `${P} is how many passes the outer loop makes. The inner loop runs on every one of those passes, so count its runs too.`);
      if (same && P > 1) {
        const c = counts[0];
        slip(c, `${c} is one pass of the inner loop. The outer loop makes ${plural(P, "pass", "passes")}, so it’s ${P} × ${c}.`);
        slip(P + c, `Adding the two loops gives ${P} + ${c}, but the inner loop runs ${plural(c, "time", "times")} on each of the ${P} passes, so multiply: ${P} × ${c}.`);
        if (sample) {
          const ends = `x runs ${first.x} through ${last.x}, and y runs ${sample.first} through ${sample.last}.`;
          slip((P - 1) * (c - 1), `That’s ${P - 1} × ${c - 1}, one short on both loops. Count both ends: ${ends}`);
          slip((P + 1) * (c + 1), `That’s ${P + 1} × ${c + 1}, one too many on both loops. Count only the values that pass the test: ${ends}`);
        }
      } else if (!same) {
        [first.count, last.count, Math.max(...counts)].forEach((k) => slip(P * k, `${P} × ${k} treats every pass alike, but the inner loop’s bounds use x, so each pass runs a different number of times. Add the passes up instead.`));
      }
      slip(total - last.count, `One pass short. The outer loop also runs for x = ${last.x}, because ${last.x} ${outer.op} ${outer.bound} is still true.`);
      slip(total - first.count, `One pass short. The outer loop starts at x = ${first.x}, and that pass counts too.`);
      try {
        const env = { x: end };
        const extra = runs(inner.startFn(env), inner.op, inner.boundFn(env), inner.step.kind, inner.step.by(env), { steps: 0 });
        if (!extra.forever && extra.count > 0) slip(total + extra.count, `One pass too many. The outer loop stops at x = ${end}, because ${end} ${outer.op} ${outer.bound} is false.`);
      } catch (err) { /* that extra pass can’t be counted, so there’s nothing to compare */ }
      if (sample) {
        const ran = passes.filter((p) => p.count > 0).length;
        slip(total - ran, `One run short on each pass. For x = ${sample.x}, the inner loop runs for y = ${sample.first} through ${sample.last}: ${plural(sample.count, "time", "times")}, counting both ends.`);
        slip(total + P, `One run too many on each pass. For x = ${sample.x}, the inner loop stops at y = ${sample.end}, because ${sample.end} ${inner.op} ${sample.bound} is false.`);
      }

      /* Counting by ones when the update jumps. */
      const byOne = (op, step, env) => {
        const up = op === "<" || op === "<=" || (op === "!=" && (step.kind === "mul" || (step.kind === "add" && step.by(env) > 0)));
        return { kind: "add", by: () => (up ? 1 : -1), text: "" };
      };
      const unit = (step, env) => step.kind === "add" && Math.abs(step.by(env)) === 1;
      if (!unit(outer.step, {})) {
        try {
          const alt = simulate({ outer: { ...outer, step: byOne(outer.op, outer.step, {}) }, inner });
          const xs = passes.slice(0, 4).map((p) => p.x).join(", ") + (P > 4 ? ", …" : "");
          if (!alt.forever) slip(alt.total, `That’s the count if x changed by 1 each pass. With ${outer.step.text}, x goes ${xs}${xs.endsWith("…") ? "" : "."}`);
        } catch (err) { /* no by-ones version to compare */ }
      }
      if (sample && !unit(inner.step, { x: sample.x })) {
        try {
          const alt = simulate({ outer, inner: { ...inner, step: byOne(inner.op, inner.step, { x: sample.x }) } });
          const ys = values(sample.first, inner.op, sample.bound, inner.step.kind, inner.step.by({ x: sample.x }));
          if (!alt.forever) slip(alt.total, `That’s the count if y changed by 1 each time. With ${inner.step.text}, it jumps: for x = ${sample.x}, y goes ${ys}${ys.endsWith("…") ? "" : "."}`);
        } catch (err) { /* no by-ones version to compare */ }
      }
      const hit = slips.find(([value]) => value === guess);
      return hit ? hit[1] : null;
    }

    function reveal(guess) {
      if (!model) return;
      const { total, forever, passes, spec } = model;
      const times = forever ? "" : plural(total, "time", "times");
      const head = el("p", "lab-result-head");
      let note = null;
      if (forever) {
        if (guess == null) head.textContent = "This loop never stops.";
        else if (guess === "never") head.textContent = "Correct. This loop never stops.";
        else head.textContent = `Not quite. This loop never stops; you said ${guess.toLocaleString()}.`;
      } else if (guess == null) {
        head.textContent = `It prints Hi ${times}.`;
      } else if (guess === "never") {
        head.textContent = `It does stop. It prints Hi ${times}.`;
        const { outer } = spec;
        note = ["Why it stops: ", passes.length
          ? `x reaches ${model.end}, and ${model.end} ${outer.op} ${outer.bound} is false, so the outer loop ends after ${plural(passes.length, "pass", "passes")}.`
          : `${outer.start} ${outer.op} ${outer.bound} is false from the start, so the loop never begins.`];
      } else if (guess === total) {
        head.textContent = `Correct. It prints Hi ${times}.`;
      } else {
        head.textContent = `Not quite. It prints Hi ${times}; you said ${guess.toLocaleString()}.`;
        const slip = diagnose(guess);
        if (slip) note = ["Likely mistake: ", slip];
        else if (passes.length) note = ["Try this: ", `write down the first and last values of x (${passes[0].x} and ${passes[passes.length - 1].x}), and how many times the inner loop runs on each of those passes. Then decide whether to multiply or add.`];
      }
      const parts = [head, el("p", null, explain())];
      if (note) {
        const p = el("p", "lab-mistake");
        p.append(el("strong", null, note[0]), document.createTextNode(note[1]));
        parts.push(p);
      }
      ui.result.replaceChildren(...parts);

      const rows = passes.slice(0, SHOW_ROWS).map((p, i) => {
        const row = el("div", "lab-dot-row");
        row.style.setProperty("--i", String(i));
        row.append(el("span", "x", `x = ${p.x}`));
        const extra = p.count > SHOW_DOTS ? ` +${(p.count - SHOW_DOTS).toLocaleString()}` : "";
        row.append(el("span", "d", "●".repeat(Math.min(p.count, SHOW_DOTS)) + extra));
        row.append(el("span", "n", p.count.toLocaleString()));
        return row;
      });
      if (forever && forever.loop === "inner" && rows.length < SHOW_ROWS) {
        const row = el("div", "lab-dot-row");
        row.style.setProperty("--i", String(rows.length));
        row.append(el("span", "x", `x = ${forever.x}`), el("span", "d", "●".repeat(SHOW_DOTS)), el("span", "n", "∞"));
        rows.push(row);
      }
      if (forever) rows.push(el("p", "lab-more", "…and it never stops."));
      else if (passes.length > SHOW_ROWS) rows.push(el("p", "lab-more", `…and ${plural(passes.length - SHOW_ROWS, "more pass", "more passes")}.`));
      ui.field.replaceChildren(...rows);
      ui.field.setAttribute("aria-hidden", "true");
      ui.field.hidden = !rows.length;
    }

    ui.check.addEventListener("click", () => {
      if (ui.never.checked) { ui.guessError.hidden = true; reveal("never"); return; }
      const raw = ui.guess.value.trim();
      if (raw === "" || !Number.isInteger(Number(raw))) {
        ui.guessError.textContent = "Enter a whole number or tick It never stops, or choose Just show me.";
        ui.guessError.hidden = false;
        ui.guess.focus();
        return;
      }
      ui.guessError.hidden = true;
      reveal(Number(raw));
    });
    ui.show.addEventListener("click", () => { ui.guessError.hidden = true; reveal(null); });
    ui.guess.addEventListener("input", () => { ui.guessError.hidden = true; });
    ui.never.addEventListener("change", () => { ui.guess.disabled = ui.never.checked; ui.guessError.hidden = true; });
    counter.querySelectorAll("[data-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        PRESETS[button.dataset.preset].forEach((value, i) => { fields[i].value = value; });
        ui.guess.value = "";
        ui.guess.disabled = ui.never.checked = false;
        compute();
      });
    });
    fields.forEach((input) => input.addEventListener("input", compute));
    compute();
  }
})();
