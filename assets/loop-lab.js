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
      counts: lab.querySelector("[data-counts]")
    };
    let plan = null;     // { n, rows: [{spaces, stars, rawSpaces, rawStars}], events, target }
    let cursor = 0;      // events already printed
    let timer = null;

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
          rows.push({ spaces, stars, rawSpaces, rawStars });
          for (let s = 1; s <= spaces; s += 1) events.push({ kind: "space", row: r, i: s, of: spaces });
          for (let k = 1; k <= stars; k += 1) events.push({ kind: "star", row: r, i: k, of: stars });
          events.push({ kind: "newline", row: r });
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
    const SHOW_ROWS = 30;
    const SHOW_DOTS = 50;
    const ui = {
      a: counter.querySelector("[data-a]"),
      b: counter.querySelector("[data-b]"),
      c: counter.querySelector("[data-c]"),
      d: counter.querySelector("[data-d]"),
      error: counter.querySelector("[data-count-error]"),
      guess: counter.querySelector("[data-guess]"),
      guessError: counter.querySelector("[data-guess-error]"),
      check: counter.querySelector("[data-check]"),
      show: counter.querySelector("[data-show]"),
      result: counter.querySelector("[data-result]"),
      field: counter.querySelector("[data-dots-field]")
    };
    let model = null;

    function compute() {
      try {
        const a = compile(ui.a.value, [])({});
        const b = compile(ui.b.value, [])({});
        const cFn = compile(ui.c.value, ["x"]);
        const dFn = compile(ui.d.value, ["x"]);
        const passes = [];
        if (b - a + 1 > MAX_PASSES) throw new Error(`That outer loop runs ${(b - a + 1).toLocaleString()} times. Keep it to ${MAX_PASSES.toLocaleString()} or fewer.`);
        for (let x = a; x <= b; x += 1) {
          const lo = cFn({ x }), hi = dFn({ x });
          passes.push({ x, count: Math.max(0, hi - lo + 1) });
        }
        model = { a, b, passes, total: passes.reduce((sum, p) => sum + p.count, 0) };
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

    function explain() {
      const { passes, total } = model;
      if (!passes.length) return "The outer loop’s condition is false from the start, so neither loop body runs.";
      const same = passes.every((p) => p.count === passes[0].count);
      if (same) {
        return `${plural(passes.length, "pass", "passes")} of the outer loop × ${plural(passes[0].count, "run", "runs")} of the inner loop each = ${total.toLocaleString()}.`;
      }
      const counts = passes.map((p) => p.count);
      const shown = counts.length <= 7 ? counts.join(" + ") : `${counts.slice(0, 4).join(" + ")} + … + ${counts.slice(-2).join(" + ")}`;
      return `The inner loop runs a different number of times on each pass: ${shown} = ${total.toLocaleString()}.`;
    }

    function reveal(guess) {
      if (!model) return;
      const { total } = model;
      const head = el("p", "lab-result-head");
      if (guess == null) head.textContent = `It prints Hi ${plural(total, "time", "times")}.`;
      else if (guess === total) head.textContent = `Correct. It prints Hi ${plural(total, "time", "times")}.`;
      else head.textContent = `Not quite. It prints Hi ${plural(total, "time", "times")}; you said ${guess.toLocaleString()}.`;
      ui.result.replaceChildren(head, el("p", null, explain()));

      const rows = model.passes.slice(0, SHOW_ROWS).map((p, i) => {
        const row = el("div", "lab-dot-row");
        row.style.setProperty("--i", String(i));
        row.append(el("span", "x", `x = ${p.x}`));
        const extra = p.count > SHOW_DOTS ? ` +${(p.count - SHOW_DOTS).toLocaleString()}` : "";
        row.append(el("span", "d", "●".repeat(Math.min(p.count, SHOW_DOTS)) + extra));
        row.append(el("span", "n", p.count.toLocaleString()));
        return row;
      });
      if (model.passes.length > SHOW_ROWS) rows.push(el("p", "lab-more", `…and ${plural(model.passes.length - SHOW_ROWS, "more pass", "more passes")}.`));
      ui.field.replaceChildren(...rows);
      ui.field.setAttribute("aria-hidden", "true");
      ui.field.hidden = false;
    }

    ui.check.addEventListener("click", () => {
      const raw = ui.guess.value.trim();
      if (raw === "" || !Number.isInteger(Number(raw))) {
        ui.guessError.textContent = "Enter a whole number first, or choose Just show me.";
        ui.guessError.hidden = false;
        ui.guess.focus();
        return;
      }
      ui.guessError.hidden = true;
      reveal(Number(raw));
    });
    ui.show.addEventListener("click", () => { ui.guessError.hidden = true; reveal(null); });
    ui.guess.addEventListener("input", () => { ui.guessError.hidden = true; });
    counter.querySelectorAll("[data-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const [a, b, c, d] = button.dataset.preset.split(",");
        ui.a.value = a; ui.b.value = b; ui.c.value = c; ui.d.value = d;
        ui.guess.value = "";
        compute();
      });
    });
    [ui.a, ui.b, ui.c, ui.d].forEach((input) => input.addEventListener("input", compute));
    compute();
  }
})();
