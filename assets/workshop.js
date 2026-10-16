/* ============================================================
   Workshop pages: highlighted code with copy buttons, and
   predict-then-reveal answers.

   Needs content.js loaded first (for highlight()).

   <pre class="ws-code" data-file="MovingBall.pde">...</pre>
     Plain source inside. It is highlighted and gets a Copy button.

   <button class="reveal-btn" type="button" aria-controls="id">Show answer</button>
   <div class="answer" id="id" hidden>...</div>
   ============================================================ */

(function () {
  document.querySelectorAll("pre.ws-code").forEach((pre) => {
    const source = pre.textContent.replace(/^\n/, "");
    pre.innerHTML = highlight(source);

    const bar = document.createElement("div");
    bar.className = "ws-code-bar";
    const name = document.createElement("span");
    name.textContent = pre.dataset.file || "";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "reveal-btn";
    copy.textContent = "Copy";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(source);
        copy.textContent = "Copied";
      } catch (err) {
        copy.textContent = "Select and copy";
      }
      setTimeout(() => { copy.textContent = "Copy"; }, 1600);
    });
    bar.append(name, copy);

    const frame = document.createElement("div");
    frame.className = "ws-code-frame";
    pre.replaceWith(frame);
    frame.append(bar, pre);
  });

  document.querySelectorAll(".reveal-btn[aria-controls]").forEach((btn) => {
    const label = btn.textContent;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const answer = document.getElementById(btn.getAttribute("aria-controls"));
      const open = !answer.hidden;
      answer.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? label : "Hide";
    });
  });

  const theme = document.getElementById("theme");
  if (theme) {
    theme.addEventListener("click", () => {
      const root = document.documentElement;
      const dark = getComputedStyle(root).getPropertyValue("--ground").trim() === "#111917";
      root.setAttribute("data-theme", dark ? "light" : "dark");
    });
  }
})();
