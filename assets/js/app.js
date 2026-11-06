(function () {
  const $ = (selector) => document.querySelector(selector);
  let prompts = [];
  let dailyIds = [];
  let activeGenre = "all";
  let activeType = "all";
  const pageSize = 12;
  let visibleCount = pageSize;
  let toastTimer;
  const favourites = new Map();

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

  async function sharePrompt(prompt) {
    const shareData = { title: prompt.title || "Writing prompt", text: prompt.text, url: window.location.href.split("#")[0] };
    if (navigator.share) {
      try { await navigator.share(shareData); return; }
      catch (error) { if (error.name === "AbortError") return; }
    }
    await copyText(prompt.text + "\n\nFind more prompts: " + shareData.url);
  }

  function updateFavouriteButton() {
    const button = $("#download-favourites");
    if (!button) return;
    button.textContent = "FAVOURITES (" + favourites.size + ") ↓";
    button.disabled = favourites.size === 0;
  }

  function downloadFavourites() {
    if (!favourites.size) return;
    const lines = ["MY SAVED WRITING PROMPTS", "========================", ""];
    for (const prompt of favourites.values()) {
      lines.push(prompt.title, "[" + prompt.genre + " / " + prompt.form + "]", "", prompt.text, "", "------------------------", "");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-writing-prompts-favourites.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Your favourites have been downloaded.");
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
    const loadMore = $("#load-more-prompts");
    if (!grid) return;
    const items = filteredPrompts();
    const visibleItems = items.slice(0, visibleCount);
    grid.replaceChildren();
    if (count) count.textContent = "SHOWING " + visibleItems.length + " OF " + items.length + " PROMPTS";
    if (empty) empty.hidden = items.length !== 0;
    if (loadMore) loadMore.hidden = visibleItems.length >= items.length;

    visibleItems.forEach((prompt, index) => {
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
      const actions = document.createElement("div");
      actions.className = "prompt-card-actions";
      const favourite = document.createElement("button");
      favourite.type = "button";
      favourite.className = "icon-button favourite-button";
      favourite.textContent = favourites.has(prompt.id) ? "★" : "☆";
      favourite.setAttribute("aria-label", favourites.has(prompt.id) ? "Remove favourite: " + prompt.title : "Save favourite: " + prompt.title);
      favourite.setAttribute("aria-pressed", String(favourites.has(prompt.id)));
      favourite.addEventListener("click", () => {
        if (favourites.has(prompt.id)) favourites.delete(prompt.id);
        else favourites.set(prompt.id, prompt);
        favourite.textContent = favourites.has(prompt.id) ? "★" : "☆";
        favourite.setAttribute("aria-pressed", String(favourites.has(prompt.id)));
        favourite.setAttribute("aria-label", favourites.has(prompt.id) ? "Remove favourite: " + prompt.title : "Save favourite: " + prompt.title);
        updateFavouriteButton();
      });
      const share = document.createElement("button");
      share.type = "button";
      share.className = "icon-button";
      share.textContent = "↗";
      share.setAttribute("aria-label", "Share prompt: " + prompt.title);
      share.addEventListener("click", () => sharePrompt(prompt));
      copy.addEventListener("click", () => copyText(prompt.text));
      actions.append(favourite, share, copy);
      footer.append(meta, actions);
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
    $("#daily-prompt-feature").textContent = prompt.text;
    $("#daily-copy").onclick = () => copyText(prompt.text);
    $("#daily-share").onclick = () => sharePrompt(prompt);
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
    $("#daily-prompt-feature").textContent = prompt.text;
    $("#daily-copy").onclick = () => copyText(prompt.text);
    $("#daily-use").onclick = () => { $("#discover").scrollIntoView({ behavior: "smooth" }); showToast("Take this idea wherever you like."); };
    $("#daily-date").textContent = "A little surprise for you";
    $("#daily").scrollIntoView({ behavior: "smooth" });
  }

  function initFilters() {
    document.querySelectorAll("[data-genre]").forEach((button) => {
      button.addEventListener("click", () => {
        activeGenre = button.dataset.genre;
        visibleCount = pageSize;
        document.querySelectorAll("[data-genre]").forEach((item) => { const selected = item === button; item.classList.toggle("is-active", selected); item.setAttribute("aria-pressed", String(selected)); });
        renderPrompts();
      });
    });
    $("#type-filter")?.addEventListener("change", (event) => {
      activeType = event.target.value;
      visibleCount = pageSize;
      renderPrompts();
    });
    $("#clear-filters")?.addEventListener("click", () => {
      activeGenre = "all";
      activeType = "all";
      visibleCount = pageSize;
      document.querySelectorAll("[data-genre]").forEach((item) => { const selected = item.dataset.genre === "all"; item.classList.toggle("is-active", selected); item.setAttribute("aria-pressed", String(selected)); });
      $("#type-filter").value = "all";
      renderPrompts();
    });
    $("#surprise-button")?.addEventListener("click", randomPrompt);
    $("#download-favourites")?.addEventListener("click", downloadFavourites);
    updateFavouriteButton();
    $("#load-more-prompts")?.addEventListener("click", () => {
      visibleCount += pageSize;
      renderPrompts();
    });
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