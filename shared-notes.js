
const notes = [
  {
    id: 1,
    title: "Machine Learning Made Simple",
    subject: "Data Science",
    difficulty: "Beginner",
    author: "Ananya Sharma",
    initials: "AS",
    date: "2026-10-23",
    likes: 42,
    views: 186,
    cover: "cover-sage",
    symbol: "✳",
    tag: "STUDY GUIDE",
    description: "Understand ML concepts, algorithms and model training.",
    content: `MACHINE LEARNING MADE SIMPLE

1. What is Machine Learning?
Machine Learning is a branch of AI that helps systems learn patterns from data.

2. Types of Machine Learning
• Supervised Learning
• Unsupervised Learning
• Reinforcement Learning

3. Common Algorithms
• Linear Regression
• Decision Tree
• Random Forest
• Logistic Regression

4. Model Evaluation
Use suitable evaluation metrics to understand model performance.

Remember:
Data → Training → Prediction → Evaluation`
  },
  {
    id: 2,
    title: "Functions in Discrete Mathematics",
    subject: "Mathematics",
    difficulty: "Intermediate",
    author: "Riya Mehta",
    initials: "RM",
    date: "2026-10-22",
    likes: 36,
    views: 149,
    cover: "cover-lilac",
    symbol: "ƒ",
    tag: "QUICK REVISION",
    description: "One-to-one, onto, into and bijective functions.",
    content: `FUNCTIONS IN DISCRETE MATHEMATICS

A function assigns every domain element exactly one codomain element.

1. Injective (One-to-One)
Different inputs have different outputs.

2. Surjective (Onto)
Every codomain element has at least one preimage.

3. Into
At least one codomain element is not mapped to.

4. Bijective
A function that is both injective and surjective.

Exam tip:
Check domain, codomain and mapping carefully.`
  },
  {
    id: 3,
    title: "Python Programming Essentials",
    subject: "Programming",
    difficulty: "Beginner",
    author: "Akash Ghosh",
    initials: "AG",
    date: "2026-10-21",
    likes: 28,
    views: 124,
    cover: "cover-peach",
    symbol: "{ }",
    tag: "CODE NOTES",
    description: "Variables, loops, conditions and functions.",
    content: `PYTHON PROGRAMMING ESSENTIALS

1. Variables
name = "Student"
age = 21

2. Conditions
if age >= 18:
    print("Adult")

3. Loops
for i in range(5):
    print(i)

4. Functions
def add(a, b):
    return a + b

Practice:
Create a calculator using functions.`
  },
  {
    id: 4,
    title: "UI Design Principles",
    subject: "UI/UX",
    difficulty: "Intermediate",
    author: "Udita Sharma",
    initials: "US",
    date: "2026-10-20",
    likes: 31,
    views: 137,
    cover: "cover-pink",
    symbol: "◌",
    tag: "DESIGN NOTES",
    description: "Learn visual hierarchy, contrast and consistency.",
    content: `UI DESIGN PRINCIPLES

1. Visual Hierarchy
Make important elements stand out.

2. Consistency
Use consistent spacing, typography and colors.

3. Contrast
Ensure text and important elements are easy to see.

4. Feedback
Give users a clear response to their actions.

5. Accessibility
Design interfaces that are usable by more people.

Design tip:
Start with user needs before choosing visual styles.`
  },
  {
    id: 5,
    title: "Statistics: A Quick Revision",
    subject: "Mathematics",
    difficulty: "Beginner",
    author: "Tanishq Sharma",
    initials: "TS",
    date: "2026-10-19",
    likes: 24,
    views: 112,
    cover: "cover-yellow",
    symbol: "∑",
    tag: "EXAM PREP",
    description: "Mean, median, mode, variance and standard deviation.",
    content: `STATISTICS QUICK REVISION

1. Mean
Sum of values divided by number of values.

2. Median
Middle value after arranging data.

3. Mode
Most frequently occurring value.

4. Variance
Measures the spread of observations.

5. Standard Deviation
Square root of variance.

Remember:
Sort data before finding the median.`
  },
  {
    id: 6,
    title: "Data Visualization Basics",
    subject: "Data Science",
    difficulty: "Intermediate",
    author: "Meera Kapoor",
    initials: "MK",
    date: "2026-10-18",
    likes: 19,
    views: 95,
    cover: "cover-blue",
    symbol: "▥",
    tag: "VISUAL NOTES",
    description: "Choose the right chart to tell a clear data story.",
    content: `DATA VISUALIZATION BASICS

1. Bar Chart
Compare categories.

2. Line Chart
Show trends over time.

3. Histogram
Understand numerical distributions.

4. Scatter Plot
Explore relationships between variables.

5. Pie Chart
Show simple parts of a whole when suitable.

Best practice:
Label charts clearly and avoid misleading scales.`
  },
  {
    id: 7,
    title: "Advanced Python Concepts",
    subject: "Programming",
    difficulty: "Advanced",
    author: "Dev Malhotra",
    initials: "DM",
    date: "2026-10-17",
    likes: 17,
    views: 86,
    cover: "cover-sage",
    symbol: "<>",
    tag: "DEEP DIVE",
    description: "Explore comprehensions, decorators and generators.",
    content: `ADVANCED PYTHON CONCEPTS

1. List Comprehension
squares = [x*x for x in range(5)]

2. Generators
Use yield to produce values lazily.

3. Decorators
Wrap a function to extend its behavior.

4. Exception Handling
Use try and except to handle errors.

Practice:
Build a generator for even numbers.`
  },
  {
    id: 8,
    title: "Design Thinking in 5 Steps",
    subject: "UI/UX",
    difficulty: "Beginner",
    author: "Kavya Rao",
    initials: "KR",
    date: "2026-10-16",
    likes: 22,
    views: 104,
    cover: "cover-peach",
    symbol: "✧",
    tag: "DESIGN GUIDE",
    description: "A simple approach to solving real user problems.",
    content: `DESIGN THINKING

1. Empathize
Understand users and their needs.

2. Define
Identify the main problem.

3. Ideate
Generate possible solutions.

4. Prototype
Create a simple representation.

5. Test
Collect feedback and improve.

Tip:
Treat feedback as an opportunity to learn.`
  },
  {
    id: 9,
    title: "Probability Fundamentals",
    subject: "Mathematics",
    difficulty: "Advanced",
    author: "Ishita Verma",
    initials: "IV",
    date: "2026-10-15",
    likes: 15,
    views: 77,
    cover: "cover-lilac",
    symbol: "P",
    tag: "CONCEPT NOTES",
    description: "Events, sample spaces and basic probability rules.",
    content: `PROBABILITY FUNDAMENTALS

1. Sample Space
Set of all possible outcomes.

2. Event
A subset of the sample space.

3. Basic Probability
P(A) = Favorable outcomes / Total outcomes
(when outcomes are equally likely)

4. Complement
P(not A) = 1 - P(A)

5. Independent Events
P(A and B) = P(A) × P(B)
when A and B are independent.`
  }
];

const grid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const sortNotes = document.getElementById("sortNotes");
const difficulty = document.getElementById("difficulty");
const noteCount = document.getElementById("noteCount");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("previewModal");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const modalLike = document.getElementById("modalLike");
const modalBookmark = document.getElementById("modalBookmark");
const modalShare = document.getElementById("modalShare");
const modalMessage = document.getElementById("modalMessage");

let selectedSubject = "All";
let selectedNote = null;
let previousFocus = null;
let toastTimer;

function loadStored(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let likedNotes = loadStored("sharedNotesLikes");
let savedNotes = loadStored("sharedNotesBookmarks");

function saveLists() {
  try {
    localStorage.setItem("sharedNotesLikes", JSON.stringify(likedNotes));
    localStorage.setItem("sharedNotesBookmarks", JSON.stringify(savedNotes));
    return true;
  } catch {
    showToast("Could not save your changes.");
    return false;
  }
}

function isLiked(id) {
  return likedNotes.includes(id);
}

function isSaved(id) {
  return savedNotes.includes(id);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getLikeCount(note) {
  return note.likes + (isLiked(note.id) ? 1 : 0);
}

function getFilteredNotes() {
  const search = searchInput.value.toLowerCase().trim();
  const level = difficulty.value;

  let result = notes.filter(note => {
    const matchesSubject =
      selectedSubject === "All" || note.subject === selectedSubject;

    const matchesLevel =
      level === "All" || note.difficulty === level;

    const matchesSearch = (
      note.title + " " +
      note.subject + " " +
      note.author + " " +
      note.description
    ).toLowerCase().includes(search);

    return matchesSubject && matchesLevel && matchesSearch;
  });

  if (sortNotes.value === "popular") {
    result.sort((a, b) => getLikeCount(b) - getLikeCount(a));
  } else if (sortNotes.value === "az") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    result.sort((a, b) => b.date.localeCompare(a.date));
  }

  return result;
}

function renderNotes() {
  const result = getFilteredNotes();

  noteCount.textContent =
    result.length + (result.length === 1 ? " note" : " notes");

  clearSearch.hidden = !searchInput.value;

  emptyState.hidden = result.length !== 0;
  grid.hidden = result.length === 0;

  grid.innerHTML = result.map(note => `
    <article class="note-card">

      <div class="note-cover ${note.cover}">
        <span class="cover-tag">${escapeHTML(note.tag)}</span>

        <span class="cover-symbol" aria-hidden="true">
          ${escapeHTML(note.symbol)}
        </span>

        <div class="cover-bottom">
          <h3>${escapeHTML(note.title)}</h3>
          <p>${escapeHTML(note.subject)} / MINDSHELF</p>
        </div>
      </div>

      <div class="note-body">

        <div class="note-meta">
          <span class="note-subject">${escapeHTML(note.subject)}</span>
          <span class="difficulty-tag">${escapeHTML(note.difficulty)}</span>
        </div>

        <h3 class="note-title">${escapeHTML(note.title)}</h3>

        <p class="note-description">
          ${escapeHTML(note.description)}
        </p>

        <div class="note-author">
          <div class="author-avatar">${escapeHTML(note.initials)}</div>
          <div class="author-info">
            <strong>${escapeHTML(note.author)}</strong>
            <span>${escapeHTML(note.date)}</span>
          </div>
        </div>

        <div class="note-footer">
          <div class="note-stats">
            <span>♡ ${getLikeCount(note)}</span>
            <span>◉ ${note.views}</span>
          </div>

          <div class="card-actions">
            <button class="icon-btn ${isLiked(note.id) ? "liked" : ""}"
              data-action="like" data-id="${note.id}"
              aria-label="${isLiked(note.id) ? "Unlike" : "Like"} note"
              aria-pressed="${isLiked(note.id)}">
              ${isLiked(note.id) ? "♥" : "♡"}
            </button>

            <button class="icon-btn ${isSaved(note.id) ? "saved" : ""}"
              data-action="save" data-id="${note.id}"
              aria-label="${isSaved(note.id) ? "Remove bookmark" : "Bookmark"}"
              aria-pressed="${isSaved(note.id)}">
              ${isSaved(note.id) ? "★" : "☆"}
            </button>

            <button class="preview-btn"
              data-action="preview" data-id="${note.id}">
              Preview ↗
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function toggleLike(id) {
  const old = [...likedNotes];

  if (isLiked(id)) {
    likedNotes = likedNotes.filter(item => item !== id);
  } else {
    likedNotes.push(id);
  }

  if (!saveLists()) {
    likedNotes = old;
    return;
  }

  renderNotes();
  updateModalButtons();

  showToast(isLiked(id) ? "Note liked ♥" : "Like removed");
}

function toggleSave(id) {
  const old = [...savedNotes];

  if (isSaved(id)) {
    savedNotes = savedNotes.filter(item => item !== id);
  } else {
    savedNotes.push(id);
  }

  if (!saveLists()) {
    savedNotes = old;
    return;
  }

  renderNotes();
  updateModalButtons();

  showToast(isSaved(id) ? "Added to your saved notes ★" : "Bookmark removed");
}

function openPreview(id) {
  const note = notes.find(item => item.id === id);

  if (!note) return;

  selectedNote = note;
  previousFocus = document.activeElement;

  modalCategory.textContent = note.subject.toUpperCase() + " · " + note.difficulty.toUpperCase();
  modalTitle.textContent = note.title;

  modalMeta.textContent =
    "By " + note.author + " · " + note.date +
    " · " + note.views + " views";

  modalContent.textContent = note.content;

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  updateModalButtons();
  modalMessage.textContent = "";

  document.getElementById("closeModal").focus();
}

function closePreview() {
  modal.hidden = true;
  document.body.style.overflow = "";

  if (previousFocus && previousFocus.isConnected) {
    previousFocus.focus();
  }

  selectedNote = null;
}

function updateModalButtons() {
  if (!selectedNote) return;

  modalLike.textContent = isLiked(selectedNote.id) ? "♥ Liked" : "♡ Like";
  modalBookmark.textContent = isSaved(selectedNote.id) ? "★ Saved" : "☆ Save";
}

async function shareNote(note) {
  const url = new URL("shared-notes.html", window.location.href);
  url.hash = "note-" + note.id;

  try {
    if (navigator.share) {
      await navigator.share({
        title: note.title,
        text: "Check out these notes on MindShelf!",
        url: url.href
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url.href);
      showToast("Note link copied!");
    } else {
      showToast("Copy this link: " + url.href);
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showToast("Could not share this note.");
    }
  }
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "like") {
    toggleLike(id);
  } else if (action === "save") {
    toggleSave(id);
  } else if (action === "preview") {
    openPreview(id);
  }
});

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    selectedSubject = button.dataset.subject;

    document.querySelectorAll(".filter-btn").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderNotes();
  });
});

searchInput.addEventListener("input", renderNotes);
sortNotes.addEventListener("change", renderNotes);
difficulty.addEventListener("change", renderNotes);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderNotes();
  searchInput.focus();
});

document.getElementById("resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  difficulty.value = "All";
  sortNotes.value = "latest";
  selectedSubject = "All";

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.subject === "All"
    );
  });

  renderNotes();
});

document.getElementById("featuredPreview").addEventListener("click", () => {
  openPreview(1);
});

document.getElementById("closeModal").addEventListener("click", closePreview);

modal.addEventListener("click", event => {
  if (event.target.dataset.close === "true") {
    closePreview();
  }
});

document.addEventListener("keydown", event => {
  if (modal.hidden) return;

  if (event.key === "Escape") {
    closePreview();
  }

  if (event.key === "Tab") {
    const focusable = [...modal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled])'
    )].filter(item => item.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

modalLike.addEventListener("click", () => {
  if (selectedNote) toggleLike(selectedNote.id);
});

modalBookmark.addEventListener("click", () => {
  if (selectedNote) toggleSave(selectedNote.id);
});

modalShare.addEventListener("click", () => {
  if (selectedNote) shareNote(selectedNote);
});

renderNotes();
