
const notesKey = "mindshelf_notes_v1";

const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const noteModal = document.getElementById("noteModal");
const noteForm = document.getElementById("noteForm");

const noteTitle = document.getElementById("noteTitle");
const noteSubject = document.getElementById("noteSubject");
const noteTags = document.getElementById("noteTags");
const noteContent = document.getElementById("noteContent");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const sortNotes = document.getElementById("sortNotes");
const toast = document.getElementById("toast");

let notes = loadNotes();
let activeFilter = "all";
let editingId = null;
let listMode = false;
let toastTimer;

// Sample notes for first-time users
function loadNotes() {
    try {
        const saved = localStorage.getItem(notesKey);

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (error) {
        console.log("Unable to load saved notes.");
    }

    const now = Date.now();

    return [
        {
            id: "sample1",
            title: "Understanding Linear Regression",
            subject: "Data Science",
            content: "Linear regression predicts a continuous value by finding the best-fit relationship between input variables and an output.\n\nKey points:\n• Simple regression uses one feature.\n• Multiple regression uses multiple features.\n• Evaluate with MAE, MSE, RMSE and R².",
            tags: ["ML basics", "revision"],
            favorite: true,
            archived: false,
            createdAt: now - 86400000 * 5,
            updatedAt: now - 86400000
        },
        {
            id: "sample2",
            title: "Functions - Quick Revision",
            subject: "Mathematics",
            content: "A function maps every element of the domain to exactly one element of the codomain.\n\nTypes:\n• Injective: Different inputs have different outputs.\n• Surjective: Every codomain element is mapped.\n• Bijective: Both injective and surjective.",
            tags: ["Unit 2", "exam prep"],
            favorite: false,
            archived: false,
            createdAt: now - 86400000 * 4,
            updatedAt: now - 86400000 * 2
        },
        {
            id: "sample3",
            title: "Design Principles to Revisit",
            subject: "UI/UX Design",
            content: "Visual hierarchy helps people understand what matters first. Use consistent spacing, readable typography, clear contrast and predictable navigation. Always validate design choices with user feedback.",
            tags: ["design", "ideas"],
            favorite: false,
            archived: false,
            createdAt: now - 86400000 * 3,
            updatedAt: now - 3600000 * 5
        },
        {
            id: "sample4",
            title: "JavaScript DOM Reminders",
            subject: "Web Development",
            content: "Useful DOM methods:\n• querySelector() selects the first match.\n• addEventListener() attaches an event.\n• classList.toggle() adds or removes a class.\n• textContent updates plain text safely.",
            tags: ["coding", "practice"],
            favorite: false,
            archived: false,
            createdAt: now - 86400000 * 2,
            updatedAt: now - 3600000 * 2
        },
        {
            id: "sample5",
            title: "Project Thoughts - MindShelf",
            subject: "Project Ideas",
            content: "Make knowledge easy to organize and revisit. Think about subject filters, quick search, collections and clear sharing controls. Access permissions should always be checked by the backend.",
            tags: ["project", "planning"],
            favorite: true,
            archived: false,
            createdAt: now - 86400000,
            updatedAt: now - 1800000
        }
    ];
}

function saveNotes() {
    try {
        localStorage.setItem(notesKey, JSON.stringify(notes));
        updateStats();
        return true;
    } catch (error) {
        showToast("Could not save. Browser storage may be full.");
        return false;
    }
}

function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function updateStats() {
    const active = notes.filter(note => !note.archived);
    const favorites = active.filter(note => note.favorite);
    const weekAgo = Date.now() - 7 * 86400000;

    const recent = active.filter(note =>
        note.updatedAt >= weekAgo
    );

    document.getElementById("totalNotes").textContent = active.length;
    document.getElementById("favoriteNotes").textContent = favorites.length;
    document.getElementById("recentNotes").textContent = recent.length;
    document.getElementById("sideNoteCount").textContent = active.length;
    document.getElementById("allTabCount").textContent = active.length;

    const bar = document.getElementById("storageBar");
    const used = new Blob([JSON.stringify(notes)]).size;

    bar.style.width = Math.min(100, Math.max(5, used / 50000 * 100)) + "%";
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
    if (diff < 86400000 * 7) return Math.floor(diff / 86400000) + "d ago";

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
}

function populateSubjects() {
    const selected = subjectFilter.value || "all";

    const subjects = [
        ...new Set(
            notes
                .filter(note => !note.archived)
                .map(note => note.subject)
                .filter(Boolean)
        )
    ].sort();

    subjectFilter.innerHTML =
        '<option value="all">All subjects</option>' +
        subjects.map(subject =>
            `<option value="${safeText(subject)}">${safeText(subject)}</option>`
        ).join("");

    subjectFilter.value = subjects.includes(selected) ? selected : "all";
}

function getVisibleNotes() {
    let visible = [...notes];

    if (activeFilter === "archived") {
        visible = visible.filter(note => note.archived);
    } else {
        visible = visible.filter(note => !note.archived);

        if (activeFilter === "favorite") {
            visible = visible.filter(note => note.favorite);
        }
    }

    if (subjectFilter.value !== "all") {
        visible = visible.filter(note =>
            note.subject === subjectFilter.value
        );
    }

    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        visible = visible.filter(note => {
            const text = [
                note.title,
                note.subject,
                note.content,
                ...(note.tags || [])
            ].join(" ").toLowerCase();

            return text.includes(query);
        });
    }

    if (sortNotes.value === "title") {
        visible.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortNotes.value === "created") {
        visible.sort((a, b) => b.createdAt - a.createdAt);
    } else {
        visible.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    return visible;
}

function renderNotes() {
    const visible = getVisibleNotes();

    updateStats();

    notesGrid.classList.toggle("list-view", listMode);

    notesGrid.innerHTML = visible.map(note => {
        const tags = (note.tags || []).slice(0, 4)
            .map(tag => `<span class="note-tag">#${safeText(tag)}</span>`)
            .join("");

        const preview = note.content.length > 240
            ? note.content.slice(0, 240) + "..."
            : note.content;

        return `
        <article class="note-card" data-note-id="${safeText(note.id)}">

            <div class="note-card-top">
                <span class="note-subject">
                    ${safeText(note.subject || "Uncategorized")}
                </span>

                <div class="note-actions">
                    <button class="note-action ${note.favorite ? "is-favorite" : ""}"
                        type="button" data-action="favorite"
                        aria-label="Toggle favorite">
                        ${note.favorite ? "★" : "☆"}
                    </button>

                    <div class="note-menu-wrap">
                        <button class="note-action" type="button"
                            data-action="menu" aria-label="More options">···</button>

                        <div class="note-menu" hidden>
                            <button type="button" data-action="edit">Edit note</button>
                            <button type="button" data-action="archive">
                                ${note.archived ? "Restore note" : "Move to archive"}
                            </button>
                            <button type="button" class="danger"
                                data-action="delete">Delete note</button>
                        </div>
                    </div>
                </div>
            </div>

            <h3 class="note-title">${safeText(note.title)}</h3>

            <p class="note-preview">${safeText(preview)}</p>

            ${tags ? `<div class="note-tags">${tags}</div>` : ""}

            <div class="note-card-footer">
                <span>${note.archived ? "Archived" : "Edited"} ${safeText(formatDate(note.updatedAt))}</span>
                <button class="note-action" type="button"
                    data-action="edit" aria-label="Open note">↗</button>
            </div>

        </article>`;
    }).join("");

    notesGrid.hidden = visible.length === 0;
    emptyState.hidden = visible.length > 0;

    document.getElementById("visibleCount").textContent =
        visible.length + (visible.length === 1 ? " note" : " notes");

    if (visible.length === 0) {
        const query = searchInput.value.trim();

        const title = document.getElementById("emptyTitle");
        const message = document.getElementById("emptyText");
        const button = document.getElementById("emptyCreateButton");

        if (query) {
            title.textContent = "No matching notes";
            message.textContent = "Try another search or clear your filters.";
            button.hidden = true;
        } else if (activeFilter === "favorite") {
            title.textContent = "No favorites just yet";
            message.textContent = "Tap the star on a note to keep it close.";
            button.hidden = true;
        } else if (activeFilter === "archived") {
            title.textContent = "Your archive is clear";
            message.textContent = "Notes you archive will appear here.";
            button.hidden = true;
        } else {
            title.textContent = "Your notebook starts here";
            message.textContent = "Capture a concept, a class summary, or a useful idea.";
            button.hidden = false;
        }
    }

    document.querySelectorAll(".filter-tab").forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.filter === activeFilter
        );
    });

    const info = document.getElementById("filterInfo");
    const labels = [];

    if (subjectFilter.value !== "all") {
        labels.push(subjectFilter.value);
    }

    if (searchInput.value.trim()) {
        labels.push("Search: " + searchInput.value.trim());
    }

    info.hidden = labels.length === 0;
    info.textContent = labels.length ? "Showing: " + labels.join(" · ") : "";
}

function openModal(note = null) {
    editingId = note ? note.id : null;

    noteForm.reset();

    noteTitle.value = note ? note.title : "";
    noteSubject.value = note ? note.subject || "" : "";
    noteTags.value = note ? (note.tags || []).join(", ") : "";
    noteContent.value = note ? note.content : "";

    document.getElementById("characterCount").textContent =
        noteContent.value.length + " characters";

    document.getElementById("modalTitle").textContent =
        note ? "Edit note" : "Create a note";

    document.getElementById("saveNoteButton").textContent =
        note ? "Save changes ↗" : "Save note ↗";

    noteModal.hidden = false;
    document.body.style.overflow = "hidden";

    setTimeout(() => noteTitle.focus(), 50);
}

function closeModal() {
    noteModal.hidden = true;
    document.body.style.overflow = "";
    editingId = null;
}

// Create and edit
document.getElementById("createNoteButton").addEventListener("click", () => {
    openModal();
});

document.getElementById("emptyCreateButton").addEventListener("click", () => {
    openModal();
});

document.getElementById("closeModalButton").addEventListener("click", closeModal);
document.getElementById("cancelModalButton").addEventListener("click", closeModal);

noteModal.addEventListener("click", event => {
    if (event.target === noteModal) closeModal();
});

noteContent.addEventListener("input", () => {
    document.getElementById("characterCount").textContent =
        noteContent.value.length + " characters";
});

noteForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) {
        showToast("Please enter a title and note content.");
        return;
    }

    const tags = [...new Set(
        noteTags.value.split(",")
            .map(tag => tag.trim())
            .filter(Boolean)
    )];

    const timestamp = Date.now();

    if (editingId) {
        const note = notes.find(item => item.id === editingId);
        if (!note) return;

        note.title = title;
        note.subject = noteSubject.value.trim() || "Uncategorized";
        note.content = content;
        note.tags = tags;
        note.updatedAt = timestamp;

        showToast("Your changes have been saved");
    } else {
        notes.unshift({
            id: window.crypto?.randomUUID
                ? crypto.randomUUID()
                : "note-" + timestamp + "-" + Math.random().toString(16).slice(2),
            title,
            subject: noteSubject.value.trim() || "Uncategorized",
            content,
            tags,
            favorite: false,
            archived: false,
            createdAt: timestamp,
            updatedAt: timestamp
        });

        activeFilter = "all";
        subjectFilter.value = "all";
        searchInput.value = "";

        showToast("New note added to your notebook");
    }

    if (!saveNotes()) return;

    closeModal();
    populateSubjects();
    renderNotes();
});

// Actions on note cards
notesGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const card = button.closest(".note-card");
    const note = notes.find(item => item.id === card.dataset.noteId);

    if (!note) return;

    const action = button.dataset.action;

    if (action === "menu") {
        const menu = button.nextElementSibling;
        const opening = menu.hidden;

        document.querySelectorAll(".note-menu").forEach(item => {
            item.hidden = true;
        });

        menu.hidden = !opening;
        return;
    }

    document.querySelectorAll(".note-menu").forEach(item => {
        item.hidden = true;
    });

    if (action === "favorite") {
        note.favorite = !note.favorite;
        note.updatedAt = Date.now();

        if (!saveNotes()) return;

        renderNotes();

        showToast(note.favorite
            ? "Added to favorites"
            : "Removed from favorites");
    }

    if (action === "edit") {
        openModal(note);
    }

    if (action === "archive") {
        note.archived = !note.archived;
        note.updatedAt = Date.now();

        if (!saveNotes()) return;

        populateSubjects();
        renderNotes();

        showToast(note.archived
            ? "Note moved to archive"
            : "Note restored");
    }

    if (action === "delete") {
        const accepted = confirm(
            `Delete "${note.title}"? This cannot be undone.`
        );

        if (!accepted) return;

        notes = notes.filter(item => item.id !== note.id);

        if (!saveNotes()) return;

        populateSubjects();
        renderNotes();
        showToast("Note deleted");
    }
});

// Filters and search
document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        activeFilter = tab.dataset.filter;
        renderNotes();
    });
});

subjectFilter.addEventListener("change", renderNotes);
sortNotes.addEventListener("change", renderNotes);
searchInput.addEventListener("input", renderNotes);

// Grid and list buttons
document.getElementById("gridView").addEventListener("click", () => {
    listMode = false;
    document.getElementById("gridView").classList.add("active");
    document.getElementById("listView").classList.remove("active");
    renderNotes();
});

document.getElementById("listView").addEventListener("click", () => {
    listMode = true;
    document.getElementById("listView").classList.add("active");
    document.getElementById("gridView").classList.remove("active");
    renderNotes();
});

// Mobile sidebar
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

document.getElementById("menuToggle").addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
});

function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

overlay.addEventListener("click", closeSidebar);

document.querySelectorAll(".sidebar .nav-link").forEach(link => {
    link.addEventListener("click", closeSidebar);
});

// Profile menu
const profileToggle = document.getElementById("profileToggle");
const profileMenu = document.getElementById("profileMenu");

profileToggle.addEventListener("click", event => {
    event.stopPropagation();

    profileMenu.hidden = !profileMenu.hidden;

    profileToggle.setAttribute(
        "aria-expanded",
        String(!profileMenu.hidden)
    );
});

document.addEventListener("click", event => {
    if (!event.target.closest("#profileDropdown")) {
        profileMenu.hidden = true;
        profileToggle.setAttribute("aria-expanded", "false");
    }

    if (!event.target.closest(".note-menu-wrap")) {
        document.querySelectorAll(".note-menu").forEach(menu => {
            menu.hidden = true;
        });
    }
});

// Keyboard shortcuts
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (!noteModal.hidden) closeModal();

        profileMenu.hidden = true;
        profileToggle.setAttribute("aria-expanded", "false");
    }

    if (
        event.key === "/" &&
        !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) &&
        noteModal.hidden
    ) {
        event.preventDefault();
        searchInput.focus();
    }
});

// Profile information
function setupProfile() {
    let name = "Student";

    try {
        name = localStorage.getItem("mindshelf_user_name") ||
               localStorage.getItem("studentName") ||
               "Student";
    } catch (error) {}

    const initials = name.trim().split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase() || "S";

    document.getElementById("sideUserName").textContent = name;
    document.getElementById("menuUserName").textContent = name;
    document.getElementById("sideAvatar").textContent = initials;
    document.getElementById("topAvatar").textContent = initials;
}

document.getElementById("notificationButton").addEventListener("click", () => {
    showToast("You're all caught up!");
});

document.getElementById("sideMore").addEventListener("click", () => {
    profileMenu.hidden = false;
    profileToggle.setAttribute("aria-expanded", "true");
});

document.getElementById("signOutButton").addEventListener("click", () => {
    showToast("Connect this button to your sign-out flow.");
    profileMenu.hidden = true;
    profileToggle.setAttribute("aria-expanded", "false");
});



function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Start page
setupProfile();
populateSubjects();
renderNotes();
