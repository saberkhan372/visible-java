/* A small, deterministic illustration of state. It does not execute user code. */
(() => {
  "use strict";
  const demo = document.querySelector("[data-state-demo]");
  if (!demo) return;
  const ball = demo.querySelector("[data-ball]");
  const trail = demo.querySelector("[data-trail]");
  const readout = demo.querySelector("[data-readout]");
  const slider = demo.querySelector("[data-step-size]");
  const stepValue = demo.querySelector("[data-step-value]");
  let x = 40;
  let frame = 0;
  let history = [];

  function render() {
    ball.setAttribute("cx", String(x));
    trail.replaceChildren(...history.map(position => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(position));
      circle.setAttribute("cy", "100");
      circle.setAttribute("r", "22");
      return circle;
    }));
    readout.textContent = `frame ${String(frame).padStart(2, "0")} → x = ${x}`;
    demo.querySelector("[data-diagram]").setAttribute("aria-label", `A circle at x = ${x}. Faint circles show its previous positions.`);
  }

  demo.querySelector("[data-step]").addEventListener("click", () => {
    history.push(x);
    history = history.slice(-6);
    x += Number(slider.value);
    if (x > 280) { x = 40; history = []; }
    frame += 1;
    render();
  });
  demo.querySelector("[data-reset]").addEventListener("click", () => {
    x = 40;
    frame = 0;
    history = [];
    render();
  });
  slider.addEventListener("input", () => { stepValue.textContent = slider.value; });
  demo.querySelectorAll("[data-code-mode]").forEach(button => {
    button.addEventListener("click", () => {
      demo.querySelectorAll("[data-code-mode]").forEach(other => other.setAttribute("aria-pressed", String(other === button)));
      demo.querySelectorAll("[data-code-panel]").forEach(panel => { panel.hidden = panel.dataset.codePanel !== button.dataset.codeMode; });
    });
  });
  demo.querySelectorAll("[data-demo-controls]").forEach(controls => { controls.hidden = false; });
  render();
})();
