
const settingIds = [
  "appearance",
  "language",
  "compact",
  "assignmentNotifications",
  "communityNotifications",
  "resourceNotifications",
  "systemNotifications",
  "profileVisibility"
];

const defaultSettings = {
  appearance: "light",
  language: "English",
  compact: false,
  assignmentNotifications: true,
  communityNotifications: true,
  resourceNotifications: true,
  systemNotifications: true,
  profileVisibility: "private"
};

function getSettings() {
  try {
    const saved = localStorage.getItem("mindshelfSettings");

    if (saved) {
      return {
        ...defaultSettings,
        ...JSON.parse(saved)
      };
    }
  } catch (error) {
    console.log("Could not load settings.");
  }

  return { ...defaultSettings };
}

let settings = getSettings();

function loadSettings() {
  settingIds.forEach(id => {
    const input = document.getElementById(id);

    if (input.type === "checkbox") {
      input.checked = Boolean(settings[id]);
    } else {
      input.value = settings[id];
    }
  });

  applySettings();
}

function applySettings() {
  document.body.classList.toggle(
    "dark",
    settings.appearance === "dark"
  );

  document.body.classList.toggle(
    "compact",
    settings.compact
  );
}

function collectSettings() {
  const updated = {};

  settingIds.forEach(id => {
    const input = document.getElementById(id);

    updated[id] = input.type === "checkbox"
      ? input.checked
      : input.value;
  });

  return updated;
}

document.getElementById("saveButton").addEventListener("click", () => {
  const updated = collectSettings();
  const message = document.getElementById("saveMessage");

  try {
    localStorage.setItem(
      "mindshelfSettings",
      JSON.stringify(updated)
    );

    settings = updated;
    applySettings();

    message.textContent = "Settings saved successfully.";
  } catch (error) {
    message.textContent = "Could not save settings. Please try again.";
  }
});

document.getElementById("resetButton").addEventListener("click", () => {
  const confirmed = confirm(
    "Reset all MindShelf preferences to their default values?"
  );

  if (!confirmed) {
    return;
  }

  settings = { ...defaultSettings };

  try {
    localStorage.setItem(
      "mindshelfSettings",
      JSON.stringify(settings)
    );

    loadSettings();

    document.getElementById("saveMessage").textContent =
      "Preferences restored to defaults.";
  } catch (error) {
    document.getElementById("saveMessage").textContent =
      "Could not reset settings.";
  }
});

document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".menu-link").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

loadSettings();
