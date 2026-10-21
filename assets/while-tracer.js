/* While-loop tracer: step through a small while loop with a live trace table.
   A parser reads the condition and statements with Java's rules for int
   arithmetic, comparisons, && || !, and String joining inside print.
   Nothing typed here is run as code. */
(() => {
  "use strict";
  const lab = document.querySelector("[data-trace-lab]");
  if (!lab) return;

  const MAX_PASSES = 200;
  const PRESETS = {
    countdown: { vars: [["n", "5"]], cond: "n > 0", body: ["System.out.println(n);", "n--;"] },
    digits: { vars: [["num", "4721"], ["sum", "0"]], cond: "num > 0", body: ["sum += num % 10;", "num /= 10;"] },
    doubling: { vars: [["x", "1"], ["steps", "0"]], cond: "x < 100", body: ["x *= 2;", "steps++;"] },
    skip: { vars: [["i", "0"]], cond: "i <= 10", body: ["System.out.print(i + \" \");", "i += 3;"] },
    gcd: { vars: [["a", "48"], ["b", "18"], ["r", "0"]], cond: "b != 0", body: ["r = a % b;", "a = b;", "b = r;"] },
    never: { vars: [["k", "10"]], cond: "k != 0", body: ["k -= 3;"] }
  };
  const RESERVED = new Set(("abstract assert boolean break byte case catch char class const continue default do double else enum " +
    "extends final finally float for goto if implements import instanceof int interface long native new package private " +
    "protected public return short static strictfp super switch synchronized this throw throws transient try void volatile " +
    "while true false null String System Math").split(" "));

  /* ---------- expressions ---------- */
  const describe = (v) => (typeof v === "boolean" ? "true or false" : typeof v === "string" ? "text" : "a number");
  const show = (v) => (typeof v === "string" ? `"${v}"` : String(v));
  const divZero = () => new Error("That divides by zero. Java would stop with an ArithmeticException.");
  const needInt = (v, op) => { if (typeof v !== "number") throw new Error(`${op} needs numbers, not ${describe(v)}.`); return v; };
  const needBool = (v, op) => { if (typeof v !== "boolean") throw new Error(`${op} needs true or false on each side, not ${describe(v)}.`); return v; };

  function tokenize(src) {
    const out = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i += 1; continue; }
      if (/[0-9]/.test(ch)) {
        let j = i;
        while (j < src.length && /[0-9]/.test(src[j])) j += 1;
        if (src[j] === ".") throw new Error("This tracer works with whole numbers (int) only.");
        out.push({ t: "num", v: Number(src.slice(i, j)) });
        i = j;
        continue;
      }
      if (ch === "\"") {
        let j = i + 1, text = "";
        while (j < src.length && src[j] !== "\"") {
          if (src[j] === "\\" && j + 1 < src.length) { text += src[j + 1] === "n" ? "\n" : src[j + 1]; j += 2; }
          else { text += src[j]; j += 1; }
        }
        if (j >= src.length) throw new Error("A string is missing its closing quote.");
        out.push({ t: "str", v: text });
        i = j + 1;
        continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        let j = i;
        while (j < src.length && /[A-Za-z0-9_.]/.test(src[j])) j += 1;
        out.push({ t: "id", v: src.slice(i, j) });
        i = j;
        continue;
      }
      const pair = src.slice(i, i + 2);
      if (["||", "&&", "==", "!=", "<=", ">="].includes(pair)) { out.push({ t: "op", v: pair }); i += 2; continue; }
      if ("+-*/%()<>!,".includes(ch)) { out.push({ t: "op", v: ch }); i += 1; continue; }
      if (ch === "=") throw new Error("Use == to compare. A single = changes a variable.");
      if (ch === "&" || ch === "|") throw new Error(`Use ${ch}${ch} for “${ch === "&" ? "and" : "or"}”.`);
      throw new Error(`“${ch}” isn’t allowed here.`);
    }
    return out;
  }

  const FUNCS = { "Math.min": [2, Math.min], "Math.max": [2, Math.max], "Math.abs": [1, Math.abs] };

  function compileExpr(src, names) {
    if (!String(src).trim()) throw new Error("Something is missing an expression.");
    const tokens = tokenize(String(src));
    let p = 0;
    const peek = () => tokens[p];
    const isOp = (...vs) => Boolean(peek() && peek().t === "op" && vs.includes(peek().v));
    const take = (v) => {
      const tk = tokens[p];
      if (!tk) throw new Error("The expression ends too soon.");
      if (v && tk.v !== v) throw new Error(`Expected “${v}” before “${tk.v}”.`);
      p += 1;
      return tk;
    };
    const level = (next, ops, apply) => () => {
      let node = next();
      while (isOp(...ops)) {
        const op = take().v;
        const left = node, right = next();
        node = (env) => apply(op, left, right, env);
      }
      return node;
    };

    const unary = () => {
      if (isOp("!")) { take(); const inner = unary(); return (env) => !needBool(inner(env), "!"); }
      if (isOp("-")) { take(); const inner = unary(); return (env) => (-needInt(inner(env), "-")) | 0; }
      if (isOp("+")) { take(); const inner = unary(); return (env) => needInt(inner(env), "+"); }
      return primary();
    };
    const multiplicative = level(unary, ["*", "/", "%"], (op, l, r, env) => {
      const a = needInt(l(env), op), b = needInt(r(env), op);
      if (op === "*") return Math.imul(a, b);
      if (b === 0) throw divZero();
      return op === "/" ? Math.trunc(a / b) | 0 : a % b;
    });
    const additive = level(multiplicative, ["+", "-"], (op, l, r, env) => {
      const a = l(env), b = r(env);
      if (op === "+" && (typeof a === "string" || typeof b === "string")) return String(a) + String(b);
      return op === "+" ? (needInt(a, "+") + needInt(b, "+")) | 0 : (needInt(a, "-") - needInt(b, "-")) | 0;
    });
    const relational = level(additive, ["<", "<=", ">", ">="], (op, l, r, env) => {
      const a = needInt(l(env), op), b = needInt(r(env), op);
      return op === "<" ? a < b : op === "<=" ? a <= b : op === ">" ? a > b : a >= b;
    });
    const equality = level(relational, ["==", "!="], (op, l, r, env) => {
      const a = l(env), b = r(env);
      if (typeof a === "string" || typeof b === "string") throw new Error("Compare text with .equals(), not == or !=.");
      if (typeof a !== typeof b) throw new Error(`${op} can’t compare ${describe(a)} with ${describe(b)}.`);
      return op === "==" ? a === b : a !== b;
    });
    const and = level(equality, ["&&"], (op, l, r, env) => needBool(l(env), "&&") && needBool(r(env), "&&"));
    const or = level(and, ["||"], (op, l, r, env) => needBool(l(env), "||") || needBool(r(env), "||"));

    function primary() {
      const tk = peek();
      if (!tk) throw new Error("The expression ends too soon.");
      if (tk.t === "num") { take(); return () => tk.v | 0; }
      if (tk.t === "str") { take(); return () => tk.v; }
      if (tk.t === "id") {
        take();
        if (tk.v === "true" || tk.v === "false") return () => tk.v === "true";
        if (FUNCS[tk.v]) {
          const [arity, fn] = FUNCS[tk.v];
          take("(");
          const args = [or()];
          while (isOp(",")) { take(); args.push(or()); }
          take(")");
          if (args.length !== arity) throw new Error(`${tk.v} takes ${arity === 1 ? "one value" : "two values"}.`);
          return (env) => fn(...args.map((a) => needInt(a(env), tk.v)));
        }
        if (names.includes(tk.v)) return (env) => env[tk.v];
        throw new Error(names.length ? `“${tk.v}” isn’t declared. Add it under Variables.` : `A starting value can’t use “${tk.v}”. Use a number.`);
      }
      if (isOp("(")) { take(); const node = or(); take(")"); return node; }
      throw new Error(`Unexpected “${tk.v}”.`);
    }

    const node = or();
    if (p < tokens.length) throw new Error(`Unexpected “${tokens[p].v}”.`);
    return node;
  }

  /* ---------- statements ---------- */
  function compileStatement(src, names) {
    const text = src.trim().replace(/;?\s*$/, ";");
    const s = src.trim().replace(/;\s*$/, "").trim();
    let m;
    if ((m = s.match(/^System\.out\.(println|print)\s*\(([\s\S]*)\)$/))) {
      const newline = m[1] === "println";
      const inner = m[2].trim();
      if (!inner && !newline) throw new Error("System.out.print needs something to print.");
      const fn = inner ? compileExpr(inner, names) : () => "";
      return { text, run: (vars) => ({ print: String(fn(vars)), newline }) };
    }
    if (/^int\s/.test(s)) throw new Error("Declare variables in the Variables boxes, above the loop.");
    if ((m = s.match(/^([A-Za-z_]\w*)\s*==/))) throw new Error(`“${s}” compares but doesn’t change anything. Use = to change ${m[1]}.`);
    m = s.match(/^([A-Za-z_]\w*)\s*(\+\+|--)$/) || s.match(/^(\+\+|--)\s*([A-Za-z_]\w*)$/);
    if (m) {
      const name = /^[A-Za-z_]/.test(m[1]) ? m[1] : m[2];
      const op = name === m[1] ? m[2] : m[1];
      if (!names.includes(name)) throw new Error(`“${name}” isn’t declared. Add it under Variables.`);
      return { text, run: (vars) => ({ set: [name, (vars[name] + (op === "++" ? 1 : -1)) | 0] }) };
    }
    m = s.match(/^([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/=|%=|=)\s*([\s\S]+)$/);
    if (m) {
      const [, name, op, rhs] = m;
      if (!names.includes(name)) throw new Error(`“${name}” isn’t declared. Add it under Variables.`);
      const fn = compileExpr(rhs, names);
      return {
        text,
        run: (vars) => {
          const v = fn(vars);
          if (typeof v !== "number") throw new Error(`${name} is an int, so it can’t hold ${describe(v)}.`);
          const cur = vars[name];
          if ((op === "/=" || op === "%=") && v === 0) throw divZero();
          const next = op === "=" ? v
            : op === "+=" ? (cur + v) | 0
            : op === "-=" ? (cur - v) | 0
            : op === "*=" ? Math.imul(cur, v)
            : op === "/=" ? Math.trunc(cur / v) | 0
            : cur % v;
          return { set: [name, next] };
        }
      };
    }
    throw new Error(`“${src.trim()}” isn’t a statement this tracer understands.`);
  }

  /* ---------- the page ---------- */
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const ui = {
    preset: lab.querySelector("[data-trace-preset]"),
    names: [...lab.querySelectorAll("[data-var-name]")],
    values: [...lab.querySelectorAll("[data-var-value]")],
    cond: lab.querySelector("[data-condition]"),
    stmts: [...lab.querySelectorAll("[data-statement]")],
    error: lab.querySelector("[data-trace-error]"),
    code: lab.querySelector("[data-trace-code]"),
    guess: lab.querySelector("[data-trace-guess]"),
    run: lab.querySelector("[data-trace-run]"),
    step: lab.querySelector("[data-trace-step]"),
    pass: lab.querySelector("[data-trace-pass]"),
    reset: lab.querySelector("[data-trace-reset]"),
    say: lab.querySelector("[data-trace-say]"),
    table: lab.querySelector("[data-trace-table]"),
    outWrap: lab.querySelector("[data-trace-output-wrap]"),
    out: lab.querySelector("[data-trace-output]"),
    verdict: lab.querySelector("[data-trace-verdict]")
  };
  let prog = null;
  let st = null;
  let timer = null;
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  function build() {
    stop();
    try {
      const vars = [];
      ui.names.forEach((input, i) => {
        const name = input.value.trim(), value = ui.values[i].value.trim();
        if (!name && !value) return;
        if (!name) throw new Error(`Variable ${i + 1} has a value but no name.`);
        if (!/^[A-Za-z_]\w*$/.test(name)) throw new Error(`“${name}” isn’t a valid Java name.`);
        if (RESERVED.has(name)) throw new Error(`“${name}” is a Java word. Pick another name.`);
        if (vars.some((v) => v.name === name)) throw new Error(`${name} is declared twice.`);
        if (!value) throw new Error(`Give ${name} a starting value.`);
        const init = compileExpr(value, [])({});
        if (typeof init !== "number") throw new Error(`${name} is an int, so it needs a whole number.`);
        vars.push({ name, init, text: value });
      });
      if (!vars.length) throw new Error("Declare at least one variable.");
      const names = vars.map((v) => v.name);
      const condText = ui.cond.value.trim();
      const cond = compileExpr(condText, names);
      const body = ui.stmts.map((s) => s.value.trim()).filter(Boolean).map((s) => compileStatement(s, names));
      prog = { vars, names, cond, condText, body };
      ui.error.hidden = true;
    } catch (err) {
      prog = null;
      ui.error.textContent = err.message;
      ui.error.hidden = false;
    }
    resetState();
  }

  function resetState() {
    stop();
    st = prog ? {
      vars: Object.fromEntries(prog.vars.map((v) => [v.name, v.init])),
      phase: "check", passes: 0, output: "", done: false, ended: null, message: "",
      line: null, lastChanged: null, steps: 0,
      rows: [{ label: "start", cond: null, values: Object.fromEntries(prog.vars.map((v) => [v.name, v.init])), printed: "", changed: new Set() }]
    } : null;
    render();
  }

  /* One step: check the condition, or run one statement. Returns false when it can't go on. */
  function step() {
    if (!st || st.done) return false;
    st.steps += 1;
    if (st.phase === "check") {
      let c;
      try { c = prog.cond(st.vars); } catch (err) { return halt(err.message); }
      if (typeof c !== "boolean") return halt(`The condition has to be true or false, like ${prog.names[0]} > 0.`);
      st.line = "cond";
      st.lastChanged = null;
      if (!c) {
        st.rows.push({ label: "check", cond: false, values: { ...st.vars }, printed: "", changed: new Set() });
        st.done = true;
        st.ended = "false";
        st.message = `Check ${prog.condText}: false, so the loop ends.`;
        return false;
      }
      if (st.passes >= MAX_PASSES) {
        st.done = true;
        st.ended = "forever";
        st.message = `Check ${prog.condText}: still true after ${MAX_PASSES} passes, so the tracer stopped here.`;
        return false;
      }
      st.passes += 1;
      st.rows.push({ label: st.passes, cond: true, values: { ...st.vars }, printed: "", changed: new Set() });
      st.message = `Check ${prog.condText}: true, so pass ${st.passes} begins.`;
      st.phase = prog.body.length ? 0 : "check";
      return true;
    }
    const index = st.phase;
    const stmt = prog.body[index];
    let res;
    try { res = stmt.run(st.vars); } catch (err) { return halt(err.message, index); }
    const row = st.rows[st.rows.length - 1];
    st.line = index;
    if (res.set) {
      const [name, value] = res.set;
      const before = st.vars[name];
      st.vars[name] = value;
      row.values[name] = value;
      row.changed.add(name);
      st.lastChanged = name;
      st.message = `${stmt.text} → ${name} was ${before}, now ${value}.`;
    } else {
      st.output += res.print + (res.newline ? "\n" : "");
      row.printed += res.print + (res.newline ? "↵" : "");
      st.lastChanged = null;
      st.message = `${stmt.text} → printed ${show(res.print)}${res.newline ? " and a new line" : ""}.`;
    }
    st.phase = index + 1 < prog.body.length ? index + 1 : "check";
    return true;
  }

  function halt(message, line) {
    st.done = true;
    st.ended = "error";
    st.message = message;
    if (line != null) st.line = line;
    return false;
  }

  function renderCode() {
    const lines = [];
    const vars = prog ? prog.vars : [];
    vars.forEach((v) => lines.push({ parts: [["k", "int"], ["", ` ${v.name} = `], ["l", v.text], ["", ";"]] }));
    if (vars.length) lines.push({ parts: [] });
    lines.push({ id: "cond", parts: [["k", "while"], ["", " ("], ["x", ui.cond.value.trim() || "?"], ["", ") {"]] });
    const stmts = prog ? prog.body.map((b) => b.text) : ui.stmts.map((s) => s.value.trim()).filter(Boolean);
    stmts.forEach((text, i) => lines.push({ id: i, parts: [["", `    ${text}`]] }));
    lines.push({ parts: [["", "}"]] });
    const classes = { k: "syn-k", l: "syn-l", x: "lab-expr" };
    ui.code.replaceChildren(...lines.map((line) => {
      const node = el("span", "lab-line");
      if (st && line.id !== undefined && line.id === st.line) node.classList.add("is-active");
      if (!line.parts.length) node.textContent = " ";
      line.parts.forEach(([kind, text]) => node.append(kind ? el("span", classes[kind], text) : document.createTextNode(text)));
      return node;
    }));
  }

  function renderTable() {
    if (!prog) { ui.table.replaceChildren(); return; }
    const caption = el("caption", "sr-only", "Trace table: one row per pass through the loop body");
    const head = el("tr");
    ["pass", "condition", ...prog.names, "printed"].forEach((h) => head.append(el("th", null, h)));
    const thead = el("thead"); thead.append(head);
    const tbody = el("tbody");
    st.rows.forEach((row, i) => {
      const tr = el("tr", row.label === "check" ? "is-end" : row.label === "start" ? "is-start" : "");
      const isLast = i === st.rows.length - 1;
      tr.append(el("th", null, String(row.label)));
      const condCell = el("td", row.cond === null ? "trace-none" : row.cond ? "trace-true" : "trace-false", row.cond === null ? "—" : String(row.cond));
      tr.append(condCell);
      prog.names.forEach((name) => {
        const td = el("td", null, String(row.values[name]));
        if (row.changed.has(name)) td.classList.add("is-changed");
        if (isLast && st.lastChanged === name) td.classList.add("is-latest");
        tr.append(td);
      });
      tr.append(el("td", "trace-printed", row.printed));
      tbody.append(tr);
    });
    ui.table.replaceChildren(caption, thead, tbody);
  }

  function render() {
    renderCode();
    renderTable();
    [ui.run, ui.step, ui.pass, ui.reset].forEach((b) => { b.disabled = !prog; });
    if (!prog) { ui.say.textContent = ""; ui.verdict.textContent = ""; ui.outWrap.hidden = true; return; }
    ui.say.textContent = st.steps ? st.message : "Ready. Predict how many passes, then step.";
    ui.outWrap.hidden = !st.output;
    ui.out.textContent = st.output;
    if (!st.done) { ui.verdict.textContent = ""; return; }
    const finals = prog.names.map((n) => `${n} = ${st.vars[n]}`).join(", ");
    let text;
    if (st.ended === "false") text = `The body ran ${st.passes} ${st.passes === 1 ? "time" : "times"}. The loop stopped because ${prog.condText} became false, with ${finals}.`;
    else if (st.ended === "forever") text = `Stopped after ${MAX_PASSES} passes: ${prog.condText} never became false, so in Java this loop would run forever. Look at how the variables change. Do they ever make the condition false?`;
    else text = `Java would stop here: ${st.message}`;
    const raw = ui.guess.value.trim();
    if (raw !== "" && st.ended === "false") {
      const g = Number(raw);
      text += g === st.passes ? " That matches your prediction." : ` You predicted ${raw}.`;
    }
    ui.verdict.textContent = text;
  }

  ui.step.addEventListener("click", () => { stop(); if (st && st.done) resetState(); step(); render(); });
  ui.pass.addEventListener("click", () => {
    stop();
    if (st && st.done) resetState();
    let started = false;
    while (step()) {
      started = true;
      if (st.phase === "check") break;
    }
    if (!started && !st.done) step();
    render();
  });
  ui.reset.addEventListener("click", resetState);
  ui.run.addEventListener("click", () => {
    stop();
    if (!prog) return;
    if (st.done || st.steps) resetState();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      while (step());
      render();
      return;
    }
    timer = setInterval(() => {
      if (st.steps >= 60) { while (step()); stop(); render(); return; }
      const more = step();
      render();
      if (!more) stop();
    }, 90);
  });
  ui.preset.addEventListener("change", () => {
    const p = PRESETS[ui.preset.value];
    ui.names.forEach((input, i) => { input.value = p.vars[i] ? p.vars[i][0] : ""; ui.values[i].value = p.vars[i] ? p.vars[i][1] : ""; });
    ui.cond.value = p.cond;
    ui.stmts.forEach((input, i) => { input.value = p.body[i] || ""; });
    ui.guess.value = "";
    build();
  });
  [...ui.names, ...ui.values, ui.cond, ...ui.stmts].forEach((input) => input.addEventListener("input", build));
  ui.guess.addEventListener("input", () => { if (st && st.done) render(); });

  ui.preset.dispatchEvent(new Event("change"));
})();
