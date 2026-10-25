
const grid = document.getElementById("resourceGrid");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sortSelect");
const previewModal = document.getElementById("previewModal");
const shareModal = document.getElementById("shareModal");
const toast = document.getElementById("toast");

const resourcesKey = "mindshelf_shared_resources";
const bookmarksKey = "mindshelf_resource_bookmarks";

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function safeUrl(value) {
    try {
        const url = new URL(value);
        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (error) {}
    return "";
}

function ago(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
}

const demoResources = [
    {
        id: "res101",
        title: "Introduction to Linear Regression",
        subject: "Data Science",
        type: "Note",
        description: "Understand linear regression, its formula, assumptions and practical prediction examples.",
        author: "Aarav Mehta",
        date: ago(1),
        views: 128,
        link: ""
    },
    {
        id: "res102",
        title: "Discrete Mathematics Revision Guide",
        subject: "Discrete Mathematics",
        type: "Guide",
        description: "Quick revision of functions, relations, sets and important exam concepts.",
        author: "Udita Sharma",
        date: ago(2),
        views: 96,
        link: ""
    },
    {
        id: "res103",
        title: "Figma UI Design Basics",
        subject: "UI/UX Design",
        type: "Video",
        description: "A beginner-friendly resource for understanding frames, components and layouts.",
        author: "Akash Ghosh",
        date: ago(3),
        views: 84,
        link: "https://help.figma.com/"
    },
    {
        id: "res104",
        title: "Python Programming Essentials",
        subject: "Programming",
        type: "Guide",
        description: "Review variables, loops, functions and common programming patterns.",
        author: "Tanishq Sharma",
        date: ago(4),
        views: 155,
        link: "https://docs.python.org/3/tutorial/"
    },
    {
        id: "res105",
        title: "HTML and CSS Quick Reference",
        subject: "Web Development",
        type: "PDF",
        description: "A helpful revision resource covering HTML structure, CSS selectors and responsive layouts.",
        author: "Riya Verma",
        date: ago(5),
        views: 72,
        link: ""
    },
    {
        id: "res106",
        title: "Prompt Engineering Fundamentals",
        subject: "Prompt Engineering",
        type: "Note",
        description: "Explore clear instructions, context, examples and prompt improvement techniques.",
        author: "Bhavaya",
        date: ago(6),
        views: 113,
        link: ""
    }
];

function loadResources() {
    try {
        const saved = localStorage.getItem(resourcesKey);

        if (saved !== null) {
            const data = JSON.parse(saved);

            if (Array.isArray(data)) {
                return data.filter(item =>
                    item &&
                    typeof item.id === "string" &&
                    typeof item.title === "string" &&
                    typeof item.subject === "string" &&
                    typeof item.author === "string" &&
                    typeof item.description === "string" &&
                    ["Note", "PDF", "Video", "Link", "Guide"].includes(item.type)
                ).map(item => ({
                    ...item,
                    views: Math.max(0, Number(item.views) || 0),
                    link: safeUrl(item.link || "")
                }));
            }
        }
    } catch (error) {
        showToast("Couldn't load saved resources.");
    }

    return demoResources;
}

function loadBookmarks() {
    try {
        const saved = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
        return new Set(Array.isArray(saved) ? saved.filter(id =>
            typeof id === "string"
        ) : []);
    } catch (error) {
        return new Set();
    }
}

let resources = loadResources();
let bookmarks = loadBookmarks();
let activeTab = "all";
let currentView = "grid";
let selectedResourceId = null;
let lastFocusedElement = null;
let toastTimer;

function saveResources() {
    try {
        localStorage.setItem(resourcesKey, JSON.stringify(resources));
        return true;
    } catch (error) {
        showToast("Couldn't save resources. Storage may be full.");
        return false;
    }
}

function saveBookmarks() {
    try {
        localStorage.setItem(bookmarksKey, JSON.stringify([...bookmarks]));
        return true;
    } catch (error) {
        showToast("Couldn't save bookmarks.");
        return false;
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function getResource(id) {
    return resources.find(item => item.id === id);
}

function getIcon(type) {
    if (type === "PDF") return "▤";
    if (type === "Video") return "▷";
    if (type === "Guide") return "✎";
    if (type === "Link") return "↗";
    return "▧";
}

function updateStats() {
    document.getElementById("resourceCount").textContent =
        resources.length;

    document.getElementById("bookmarkCount").textContent =
        bookmarks.size;

    document.getElementById("contributorCount").textContent =
        new Set(resources.map(item => item.author)).size;
}

function updateSubjects() {
    const selected = subjectFilter.value;

    const subjects = [...new Set(
        resources.map(item => item.subject)
    )].sort((a, b) => a.localeCompare(b));

    subjectFilter.innerHTML =
        '<option value="all">All subjects</option>';

    subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });

    if (subjects.includes(selected)) {
        subjectFilter.value = selected;
    }
}

function getFilteredResources() {
    const search = searchInput.value.trim().toLowerCase();
    const subject = subjectFilter.value;
    const type = typeFilter.value;

    let result = resources.filter(item => {
        const matchesSearch = [
            item.title,
            item.subject,
            item.description,
            item.author
        ].some(value => value.toLowerCase().includes(search));

        const matchesSubject =
            subject === "all" || item.subject === subject;

        const matchesType =
            type === "all" || item.type === type;

        const matchesTab =
            activeTab === "bookmarks"
                ? bookmarks.has(item.id)
                : true;

        return matchesSearch && matchesSubject &&
            matchesType && matchesTab;
    });

    if (activeTab === "popular" || sortSelect.value === "popular") {
        result.sort((a, b) => b.views - a.views);
    } else if (sortSelect.value === "name") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        result.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );
    }

    return result;
}

function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function renderResources() {
    updateStats();
    updateSubjects();

    const items = getFilteredResources();
    grid.innerHTML = "";

    grid.className = "resource-grid";

    if (currentView === "list") {
        grid.classList.add("list-view");
    }

    document.getElementById("clearSearch").hidden =
        !searchInput.value;

    document.getElementById("resultsCount").textContent =
        `${items.length} ${items.length === 1 ? "resource" : "resources"} found`;

    const emptyState = document.getElementById("emptyState");

    if (items.length === 0) {
        grid.hidden = true;
        emptyState.hidden = false;

        document.getElementById("emptyTitle").textContent =
            activeTab === "bookmarks"
                ? "No bookmarks yet."
                : "No resources found.";

        document.getElementById("emptyMessage").textContent =
            activeTab === "bookmarks"
                ? "Bookmark useful resources and they will appear here."
                : "Try another search or change your filters.";

        document.getElementById("resetFilters").hidden =
            activeTab === "bookmarks" && bookmarks.size === 0;

        return;
    }

    grid.hidden = false;
    emptyState.hidden = true;

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "resource-card";

        const isSaved = bookmarks.has(item.id);
        const typeClass = item.type.toLowerCase();

        card.innerHTML = `
            <div class="resource-top">
                <div class="type-icon ${typeClass}">
                    ${getIcon(item.type)}
                </div>

                <button class="bookmark-btn ${isSaved ? "saved" : ""}"
                        data-bookmark="${escapeHTML(item.id)}"
                        aria-label="${isSaved ? "Remove bookmark" : "Bookmark resource"}"
                        aria-pressed="${isSaved}">
                    ${isSaved ? "♥" : "♡"}
                </button>
            </div>

            <span class="resource-type">${escapeHTML(item.type)}</span>

            <h3>${escapeHTML(item.title)}</h3>

            <p class="resource-description">
                ${escapeHTML(item.description)}
            </p>

            <span class="resource-subject">
                ◈ ${escapeHTML(item.subject)}
            </span>

            <div class="resource-footer">
                <span class="author">By ${escapeHTML(item.author)}</span>

                <div class="resource-stats">
                    <span>◉ ${item.views}</span>
                    <span>${formatDate(item.date)}</span>
                </div>
            </div>

            <div class="resource-actions">
                <button class="preview-btn"
                        data-preview="${escapeHTML(item.id)}">
                    Preview details
                </button>

                ${safeUrl(item.link)
                    ? `<button class="open-btn"
                               data-open="${escapeHTML(item.id)}">
                           Open ↗
                       </button>`
                    : `<button class="open-btn"
                               data-preview="${escapeHTML(item.id)}">
                           View details
                       </button>`
                }
            </div>
        `;

        grid.appendChild(card);
    });
}

grid.addEventListener("click", event => {
    const bookmarkBtn = event.target.closest("[data-bookmark]");
    const previewBtn = event.target.closest("[data-preview]");
    const openBtn = event.target.closest("[data-open]");

    if (bookmarkBtn) {
        toggleBookmark(bookmarkBtn.dataset.bookmark);
        return;
    }

    if (previewBtn) {
        openPreview(previewBtn.dataset.preview);
        return;
    }

    if (openBtn) {
        openResourceLink(openBtn.dataset.open);
    }
});

function toggleBookmark(id) {
    const item = getResource(id);
    if (!item) return;

    const previous = new Set(bookmarks);

    if (bookmarks.has(id)) {
        bookmarks.delete(id);
        showToast("Bookmark removed.");
    } else {
        bookmarks.add(id);
        showToast("Resource bookmarked!");
    }

    if (!saveBookmarks()) {
        bookmarks = previous;
        return;
    }

    renderResources();

    if (!previewModal.hidden && selectedResourceId === id) {
        updatePreviewBookmark();
    }
}

function openResourceLink(id) {
    const item = getResource(id);
    if (!item) return;

    const url = safeUrl(item.link || "");

    if (!url) {
        showToast("No external link is available for this resource.");
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
}

function openPreview(id) {
    const item = getResource(id);
    if (!item) return;

    selectedResourceId = id;
    lastFocusedElement = document.activeElement;

    document.getElementById("previewTitle").textContent = item.title;

    document.getElementById("previewMeta").innerHTML = `
        <span>${escapeHTML(item.type)}</span>
        <span>${escapeHTML(item.subject)}</span>
        <span>Shared ${formatDate(item.date)}</span>
    `;

    document.getElementById("previewDescription").textContent =
        item.description;

    document.getElementById("previewAuthor").textContent =
        item.author;

    document.getElementById("previewType").textContent =
        item.type;

    const openBtn = document.getElementById("openResource");
    const url = safeUrl(item.link || "");

    openBtn.hidden = !url;

    if (url) {
        openBtn.href = url;
    } else {
        openBtn.removeAttribute("href");
    }

    updatePreviewBookmark();

    previewModal.hidden = false;
    document.getElementById("closePreview").focus();
}

function updatePreviewBookmark() {
    const button = document.getElementById("previewBookmark");
    const isSaved = bookmarks.has(selectedResourceId);

    button.textContent = isSaved ? "♥ Bookmarked" : "♡ Bookmark";
    button.setAttribute("aria-pressed", String(isSaved));
}

function closePreview() {
    previewModal.hidden = true;
    selectedResourceId = null;

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
    }
}

document.getElementById("closePreview").addEventListener("click", closePreview);

previewModal.addEventListener("click", event => {
    if (event.target === previewModal) closePreview();
});

document.getElementById("previewBookmark").addEventListener("click", () => {
    if (selectedResourceId) {
        toggleBookmark(selectedResourceId);
    }
});

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        activeTab = button.dataset.tab;

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.toggle("active", tab === button);
        });

        renderResources();
    });
});

searchInput.addEventListener("input", renderResources);
subjectFilter.addEventListener("change", renderResources);
typeFilter.addEventListener("change", renderResources);
sortSelect.addEventListener("change", renderResources);

document.getElementById("clearSearch").addEventListener("click", () => {
    searchInput.value = "";
    renderResources();
    searchInput.focus();
});

document.getElementById("resetFilters").addEventListener("click", () => {
    searchInput.value = "";
    subjectFilter.value = "all";
    typeFilter.value = "all";
    sortSelect.value = "newest";
    activeTab = "all";

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === "all");
    });

    renderResources();
});

document.querySelectorAll(".view-btn").forEach(button => {
    button.addEventListener("click", () => {
        currentView = button.dataset.view;

        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        renderResources();
    });
});

document.getElementById("exploreBtn").addEventListener("click", () => {
    document.getElementById("resourceSection").scrollIntoView({
        behavior: "smooth"
    });

    searchInput.focus({ preventScroll: true });
});

function openShareModal() {
    lastFocusedElement = document.activeElement;
    document.getElementById("shareForm").reset();
    document.getElementById("shareError").textContent = "";
    shareModal.hidden = false;
    document.getElementById("shareName").focus();
}

function closeShareModal() {
    shareModal.hidden = true;

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
    }
}

document.getElementById("shareBtn").addEventListener("click", openShareModal);

document.getElementById("closeShare").addEventListener("click", closeShareModal);
document.getElementById("cancelShare").addEventListener("click", closeShareModal);

shareModal.addEventListener("click", event => {
    if (event.target === shareModal) closeShareModal();
});

document.getElementById("shareForm").addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("shareName").value.trim();
    const subject = document.getElementById("shareSubject").value.trim();
    const type = document.getElementById("shareType").value;
    const description = document.getElementById("shareDescription").value.trim();
    const linkInput = document.getElementById("shareUrl").value.trim();
    const error = document.getElementById("shareError");

    error.textContent = "";

    if (!title || !subject || !description || !linkInput) {
        error.textContent = "Please complete all fields.";
        return;
    }

    const link = safeUrl(linkInput);

    if (!link) {
        error.textContent = "Enter a valid HTTP or HTTPS URL.";
        return;
    }

    const duplicate = resources.some(item =>
        item.title.toLowerCase() === title.toLowerCase() &&
        item.author === "Bhavaya"
    );

    if (duplicate) {
        error.textContent = "You have already shared a resource with this title.";
        return;
    }

    const resource = {
        id: createId(),
        title,
        subject,
        type,
        description,
        author: "Bhavaya",
        date: new Date().toISOString(),
        views: 0,
        link
    };

    resources.unshift(resource);

    if (!saveResources()) {
        resources.shift();
        return;
    }

    closeShareModal();

    searchInput.value = "";
    subjectFilter.value = "all";
    typeFilter.value = "all";
    sortSelect.value = "newest";
    activeTab = "all";

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === "all");
    });

    renderResources();
    showToast("Resource submitted in this browser!");
});

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

document.addEventListener("click", event => {
    if (
        window.innerWidth <= 850 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (!previewModal.hidden) {
            closePreview();
        } else if (!shareModal.hidden) {
            closeShareModal();
        } else {
            sidebar.classList.remove("open");
        }
    }
});

renderResources();
