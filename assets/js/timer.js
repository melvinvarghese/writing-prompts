(function () {
  const state = { duration: 600, remaining: 600, endAt: null, interval: null, running: false };
  const root = document.getElementById("writing-prompts-app");
  const $ = (selector) => root?.querySelector(selector);
  const display = () => $("#timer-display");
  const message = () => $("#timer-message");
  const startButton = () => $("#timer-start");

  function render() {
    const node = display();
    if (!node) return;
    const mins = Math.floor(state.remaining / 60).toString().padStart(2, "0");
    const secs = (state.remaining % 60).toString().padStart(2, "0");
    node.textContent = mins + ":" + secs;
    if (startButton()) startButton().innerHTML = state.running ? "Pause session <span aria-hidden='true'>Ⅱ</span>" : (state.remaining === 0 ? "START AGAIN <span aria-hidden='true'>↻</span>" : (state.remaining < state.duration ? "RESUME WRITING <span aria-hidden='true'>→</span>" : "START GAME <span aria-hidden='true'>→</span>"));
  }

  function stopInterval() {
    if (state.interval) window.clearInterval(state.interval);
    state.interval = null;
  }

  function tick() {
    state.remaining = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
    if (state.remaining <= 0) {
      state.running = false;
      state.endAt = null;
      stopInterval();
      if (message()) message().textContent = "Your writing session is complete. Take a breath.";
    }
    render();
  }

  function pause() {
    if (!state.running) return;
    state.remaining = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
    state.running = false;
    state.endAt = null;
    stopInterval();
    if (message()) message().textContent = "Paused. Your words will wait.";
    render();
  }

  function start() {
    if (state.running) return pause();
    if (state.remaining <= 0) state.remaining = state.duration;
    state.running = true;
    state.endAt = Date.now() + state.remaining * 1000;
    if (message()) message().textContent = "One thought at a time. Keep going.";
    stopInterval();
    state.interval = window.setInterval(tick, 250);
    render();
  }

  function reset() {
    state.running = false;
    state.endAt = null;
    state.remaining = state.duration;
    stopInterval();
    if (message()) message().textContent = "A small beginning is still a beginning.";
    render();
  }

  function setDuration(minutes) {
    state.duration = minutes * 60;
    reset();
    root.querySelectorAll(".timer-presets button").forEach((button) => {
      const selected = Number(button.dataset.minutes) === minutes;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function initTimer() {
    document.querySelectorAll(".timer-presets button").forEach((button) => {
      button.setAttribute("aria-pressed", button.classList.contains("is-selected") ? "true" : "false");
      button.addEventListener("click", () => setDuration(Number(button.dataset.minutes)));
    });
    startButton()?.addEventListener("click", start);
    $("#timer-reset")?.addEventListener("click", reset);
    document.addEventListener("visibilitychange", () => { if (state.running && !document.hidden) tick(); });
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initTimer, { once: true });
  else initTimer();
})();