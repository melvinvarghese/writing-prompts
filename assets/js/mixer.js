(function () {
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  window.WritingPromptMixer = {
    async load() {
      const response = await fetch("https://melvinvarghese.github.io/writing-prompts/data/mixer-elements.json");
      if (!response.ok) throw new Error("Could not load mixer ingredients.");
      return response.json();
    },
    create(elements) {
      return {
        character: pick(elements.characters),
        setting: pick(elements.settings),
        conflict: pick(elements.conflicts),
        twist: pick(elements.twists)
      };
    },
    compose(parts) {
      return `${parts.character} is at ${parts.setting.toLowerCase()}. ${parts.conflict}. But there is one thing they do not know: ${parts.twist.toLowerCase()}.`;
    }
  };
})();