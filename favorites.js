
const favoriteList = document.getElementById("favoriteList");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const favoriteCount = document.getElementById("favoriteCount");
const emptyState = document.getElementById("emptyState");

let activeType = "all";
let listView = false;

const sampleFavorites = [
  {
    id: 1,
    title: "Types of Functions in Discrete Mathematics",
    subject: "Mathematics",
    type: "note",
    description: "Types of functions, domain, codomain, one-one, onto and bijective functions.",
    link: "my-notes.html",
    updated: "Edited recently"
  },
  {
    id: 2,
    title: "Understanding Linear Regression",
    subject: "Data Science",
    type: "note",
    description: "Linear regression predicts a continuous value by finding the best-fit relationship.",
    link: "my-notes.html",
    updated: "Edited recently"
  },
  {
    id: 3,
    title: "Design Principles to Revisit",
    subject: "UI/UX Design",
    type: "note",
    description: "Visual hierarchy, spacing, readability, contrast and predictable navigation.",
    link: "my-notes.html",
    updated: "Edited recently"
  },
  {
    id: 4,
    title: "JavaScript Learning Guide",
    subject: "Web Development",
    type: "resource",
    description: "A saved learning resource for JavaScript fundamentals and DOM methods.",
    link: "shared-resources.html",
    updated: "Saved recently"
  },
  {
    id: 5,
    title: "Statistics Revision",
    subject: "Mathematics",
    type: "resource",
    description: "Revision material for important statistics concepts and formulas.",
    link: "shared-resources.html",
    updated: "Saved recently"
  }
];

function getFavorites() {
  const saved = localStorage.getItem("mindshelfFavorites");

  if (saved !== null) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.log("Could not load favorites.");
    }
  }

  localStorage.setItem(
    "mindshelfFavorites",
    JSON.stringify(sampleFavorites)
  );

  return sampleFavorites;
}

let favorites = getFavorites();

function saveFavorites() {
  localStorage.setItem(
    "mindshelfFavorites",
    JSON.stringify(favorites)
  );
}

function loadSubjects() {
  const subjects = [...new Set(favorites.map(item => item.subject))];

  subjectFilter.innerHTML = '<option value="all">All subjects</option>';

  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectFilter.appendChild(option);
  });
}

function renderFavorites() {
  const search = searchInput.value.toLowerCase();
  const subject = subjectFilter.value;

  const filtered = favorites.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search) ||
      item.subject.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);

    const matchesSubject =
      subject === "all" || item.subject === subject;

    const matchesType =
      activeType === "all" || item.type === activeType;

    return matchesSearch && matchesSubject && matchesType;
  });

  favoriteCount.textContent = favorites.length;
  favoriteList.innerHTML = "";

  favoriteList.classList.toggle("list-view", listView);
  emptyState.hidden = filtered.length !== 0;
  favoriteList.hidden = filtered.length === 0;

  if (favorites.length === 0) {
    document.getElementById("emptyTitle").textContent = "No favorites yet";
    document.getElementById("emptyMessage").textContent =
      "Add your favorite notes and resources to find them here.";
  } else if (filtered.length === 0) {
    document.getElementById("emptyTitle").textContent = "No results found";
    document.getElementById("emptyMessage").textContent =
      "Try another search or change your filters.";
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "favorite-card";

    const top = document.createElement("div");
    top.className = "card-top";

    const badge = document.createElement("span");
    badge.className = "subject";
    badge.textContent = item.subject;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const star = document.createElement("button");
    star.className = "star";
    star.textContent = "★";
    star.title = "Remove from favorites";
    star.setAttribute("aria-label", "Remove " + item.title + " from favorites");

    star.addEventListener("click", () => {
      favorites = favorites.filter(fav => fav.id !== item.id);
      saveFavorites();
      loadSubjects();
      renderFavorites();
    });

    actions.appendChild(star);
    top.append(badge, actions);

    const title = document.createElement("h2");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "card-description";
    description.textContent = item.description;

    const bottom = document.createElement("div");
    bottom.className = "card-bottom";

    const meta = document.createElement("span");
    meta.className = "card-meta";
    meta.textContent =
      (item.type === "note" ? "NOTE" : "RESOURCE") +
      " · " + item.updated;

    const link = document.createElement("a");
    link.className = "open-link";
    link.href = item.link;
    link.textContent = "Open →";

    bottom.append(meta, link);
    card.append(top, title, description, bottom);
    favoriteList.appendChild(card);
  });
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");
    activeType = tab.dataset.type;
    renderFavorites();
  });
});

searchInput.addEventListener("input", renderFavorites);
subjectFilter.addEventListener("change", renderFavorites);

document.getElementById("gridBtn").addEventListener("click", () => {
  listView = false;
  document.getElementById("gridBtn").classList.add("selected");
  document.getElementById("listBtn").classList.remove("selected");
  renderFavorites();
});

document.getElementById("listBtn").addEventListener("click", () => {
  listView = true;
  document.getElementById("listBtn").classList.add("selected");
  document.getElementById("gridBtn").classList.remove("selected");
  renderFavorites();
});

loadSubjects();
renderFavorites();
