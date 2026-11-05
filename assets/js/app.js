(function () {
  const $ = (selector) => document.querySelector(selector);
  let prompts = [];
  let dailyIds = [];
  let activeGenre = "all";
  let activeType = "all";
  let toastTimer;

  function showToast(text) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      showToast("Prompt copied. Now make it your own.");
    } catch (error) {
      showToast("Copy isn't available here. Please select the prompt text.");
    }
  }

  function label(value) {
    return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function filteredPrompts() {
    return prompts.filter((prompt) => {
      const genreMatch = activeGenre === "all" || prompt.genre === activeGenre;
      const typeMatch = activeType === "all" || prompt.type === activeType;
      return genreMatch && typeMatch;
    });
  }

  function renderPrompts() {
    const grid = $("#prompt-grid");
    const empty = $("#empty-state");
    const count = $("#results-count");
    if (!grid) return;
    const items = filteredPrompts();
    grid.replaceChildren();
    if (count) count.textContent = items.length + (items.length === 1 ? " idea to get you started" : " ideas to get you started");
    if (empty) empty.hidden = items.length !== 0;

    items.forEach((prompt, index) => {
      const card = document.createElement("article");
      card.className = "prompt-card" + (index === 0 ? " prompt-card-featured" : "");
      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = String(index + 1).padStart(2, "0") + " / " + label(prompt.type).toUpperCase();
      const text = document.createElement("p");
      text.className = "prompt-card-text";
      text.textContent = prompt.text;
      const footer = document.createElement("div");
      footer.className = "prompt-card-footer";
      const meta = document.createElement("span");
      meta.textContent = (prompt.genre + " · " + prompt.form).toUpperCase();
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "icon-button";
      copy.setAttribute("aria-label", "Copy prompt: " + prompt.title);
      copy.textContent = "↗";
      copy.addEventListener("click", () => copyText(prompt.text));
      footer.append(meta, copy);
      card.append(number, text, footer);
      grid.append(card);
    });
  }

  function setDailyPrompt() {
    if (!prompts.length) return;
    const now = new Date();
    const dateText = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(now);
    $("#daily-date").textContent = dateText;
    const dayIndex = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
    const id = dailyIds.length ? dailyIds[((dayIndex % dailyIds.length) + dailyIds.length) % dailyIds.length] : prompts[dayIndex % prompts.length].id;
    const prompt = prompts.find((item) => item.id === id) || prompts[0];
    $("#daily-category").textContent = (prompt.genre + " · " + prompt.type).toUpperCase();
    $("#daily-prompt-text").textContent = prompt.text;
    $("#daily-copy").onclick = () => copyText(prompt.text);
    $("#daily-use").onclick = () => {
      $("#discover").scrollIntoView({ behavior: "smooth" });
      showToast("Take this idea wherever you like.");
    };
  }

  function randomPrompt() {
    const items = filteredPrompts();
    if (!items.length) {
      showToast("Try clearing a filter to discover more prompts.");
      return;
    }
    const prompt = items[Math.floor(Math.random() * items.length)];
    $("#daily-category").textContent = (prompt.genre + " · " + prompt.type).toUpperCase();
    $("#daily-prompt-text").textContent = prompt.text;
    $("#daily-date").textContent = "A little surprise for you";
    $("#daily").scrollIntoView({ behavior: "smooth" });
  }

  function initFilters() {
    document.querySelectorAll("[data-genre]").forEach((button) => {
      button.addEventListener("click", () => {
        activeGenre = button.dataset.genre;
        document.querySelectorAll("[data-genre]").forEach((item) => item.classList.toggle("is-active", item === button));
        renderPrompts();
      });
    });
    $("#type-filter")?.addEventListener("change", (event) => {
      activeType = event.target.value;
      renderPrompts();
    });
    $("#clear-filters")?.addEventListener("click", () => {
      activeGenre = "all";
      activeType = "all";
      document.querySelectorAll("[data-genre]").forEach((item) => item.classList.toggle("is-active", item.dataset.genre === "all"));
      $("#type-filter").value = "all";
      renderPrompts();
    });
    $("#surprise-button")?.addEventListener("click", randomPrompt);
  }

  async function initMixer() {
    try {
      const elements = await window.WritingPromptMixer.load();
      function mix() {
        const parts = window.WritingPromptMixer.create(elements);
        $("#mix-character").textContent = parts.character;
        $("#mix-setting").textContent = parts.setting;
        $("#mix-conflict").textContent = parts.conflict;
        $("#mix-twist").textContent = parts.twist;
        $("#mix-result").textContent = window.WritingPromptMixer.compose(parts);
      }
      $("#mix-again")?.addEventListener("click", mix);
      $("#mix-copy")?.addEventListener("click", () => copyText($("#mix-result").textContent));
      mix();
    } catch (error) {
      $("#mix-result").textContent = "The story mixer could not load. Please refresh the page and try again.";
      $("#mix-again")?.setAttribute("disabled", "disabled");
    }
  }

  async function init() {
    initFilters();
    try {
      const [promptResponse, dailyResponse] = await Promise.all([
        fetch("data/prompts.json"),
        fetch("data/daily-prompts.json")
      ]);
      if (!promptResponse.ok) throw new Error("Prompt collection unavailable");
      prompts = await promptResponse.json();
      dailyIds = dailyResponse.ok ? await dailyResponse.json() : [];
      setDailyPrompt();
      renderPrompts();
    } catch (error) {
      $("#results-count").textContent = "The prompt collection could not be loaded.";
      $("#prompt-grid").replaceChildren();
      $("#empty-state").hidden = false;
      $("#empty-state").textContent = "Please refresh the page in a moment. The prompts are temporarily unavailable.";
    }
    initMixer();
  }

  document.addEventListener("DOMContentLoaded", init);
})();