
const grid = document.getElementById("collectionsGrid");
const modal = document.getElementById("collectionModal");
const detailModal = document.getElementById("detailModal");
const form = document.getElementById("collectionForm");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

const storageKey = "mindshelf_collections";

function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function makeDate() {
    return new Date().toISOString();
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

const demoCollections = [
    {
        id: makeId(),
        name: "Machine Learning Essentials",
        subject: "Data Science",
        description: "Important ML concepts, algorithms and revision notes.",
        resources: [
            {
                id: makeId(),
                name: "Introduction to Linear Regression",
                type: "Note",
                link: ""
            },
            {
                id: makeId(),
                name: "Decision Tree Notes",
                type: "Note",
                link: ""
            }
        ],
        createdAt: makeDate(),
        updatedAt: makeDate()
    },
    {
        id: makeId(),
        name: "Discrete Mathematics",
        subject: "Discrete Mathematics",
        description: "Functions, relations, logic and exam preparation.",
        resources: [
            {
                id: makeId(),
                name: "Types of Functions",
                type: "Note",
                link: ""
            }
        ],
        createdAt: makeDate(),
        updatedAt: makeDate()
    },
    {
        id: makeId(),
        name: "UI/UX Inspiration",
        subject: "UI/UX Design",
        description: "Design ideas, references and interface inspiration.",
        resources: [],
        createdAt: makeDate(),
        updatedAt: makeDate()
    }
];

function loadCollections() {
    try {
        const saved = localStorage.getItem(storageKey);

        if (saved !== null) {
            const data = JSON.parse(saved);
            if (Array.isArray(data)) {
                return data.filter(item =>
                    item &&
                    typeof item.id === "string" &&
                    typeof item.name === "string" &&
                    typeof item.subject === "string" &&
                    Array.isArray(item.resources)
                ).map(item => ({
                    ...item,
                    description: typeof item.description === "string"
                        ? item.description : "",
                    createdAt: item.createdAt || makeDate(),
                    updatedAt: item.updatedAt || makeDate(),
                    resources: item.resources.filter(resource =>
                        resource &&
                        typeof resource.id === "string" &&
                        typeof resource.name === "string"
                    ).map(resource => ({
                        ...resource,
                        type: resource.type || "Other",
                        link: safeUrl(resource.link || "")
                    }))
                }));
            }
        }
    } catch (error) {
        showToast("Couldn't read saved collections.");
    }

    return demoCollections;
}

let collections = loadCollections();
let editingId = null;
let activeCollectionId = null;
let currentView = "grid";
let lastFocusedElement = null;
let toastTimer;

function saveCollections() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(collections));
        return true;
    } catch (error) {
        showToast("Couldn't save. Browser storage may be full.");
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

function formatDate(date) {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Recently";
    }

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getCollection(id) {
    return collections.find(item => item.id === id);
}

function updateStats() {
    document.getElementById("totalCount").textContent =
        collections.length;

    document.getElementById("resourceCount").textContent =
        collections.reduce((total, item) =>
            total + item.resources.length, 0);

    document.getElementById("subjectCount").textContent =
        new Set(collections.map(item => item.subject)).size;
}

function updateSubjectOptions() {
    const selected = subjectFilter.value;

    const subjects = [...new Set(
        collections.map(item => item.subject)
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

function getFilteredCollections() {
    const search = searchInput.value.trim().toLowerCase();
    const subject = subjectFilter.value;

    let result = collections.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.subject.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            item.resources.some(resource =>
                resource.name.toLowerCase().includes(search)
            );

        const matchesSubject =
            subject === "all" || item.subject === subject;

        return matchesSearch && matchesSubject;
    });

    if (sortSelect.value === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortSelect.value === "resources") {
        result.sort((a, b) =>
            b.resources.length - a.resources.length
        );
    } else {
        result.sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }

    return result;
}

function renderCollections() {
    updateStats();
    updateSubjectOptions();

    const items = getFilteredCollections();

    grid.className = "collections-grid";
    if (currentView === "list") {
        grid.classList.add("list-view");
    }

    grid.innerHTML = "";

    document.getElementById("visibleCount").textContent =
        items.length + (items.length === 1 ? " collection" : " collections");

    document.getElementById("clearSearch").hidden =
        searchInput.value.length === 0;

    if (items.length === 0) {
        emptyState.hidden = false;
        grid.hidden = true;

        const hasCollections = collections.length > 0;

        document.getElementById("emptyTitle").textContent =
            hasCollections ? "No collections found." : "Your space is waiting.";

        document.getElementById("emptyMessage").textContent =
            hasCollections
                ? "Try another search or change your filters."
                : "Create your first collection and start organizing your learning.";

        document.getElementById("emptyCreateBtn").hidden = hasCollections;
        return;
    }

    emptyState.hidden = true;
    grid.hidden = false;

    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "collection-card";

        const colors = ["", "color-1", "color-2", "color-3", "color-4"];
        const color = colors[index % colors.length];

        card.innerHTML = `
            <div class="card-top">
                <div class="folder-icon ${color}">▣</div>

                <div class="card-menu-wrap">
                    <button class="card-menu-btn"
                            data-action="menu"
                            data-id="${escapeHTML(item.id)}"
                            aria-label="Collection options"
                            aria-expanded="false">⋯</button>
                    <div class="card-menu" hidden>
                        <button data-action="edit"
                                data-id="${escapeHTML(item.id)}">Edit</button>
                        <button data-action="open"
                                data-id="${escapeHTML(item.id)}">Open</button>
                        <button class="danger"
                                data-action="delete"
                                data-id="${escapeHTML(item.id)}">Delete</button>
                    </div>
                </div>
            </div>

            <h3 class="card-title">${escapeHTML(item.name)}</h3>

            <p class="card-description">
                ${escapeHTML(item.description || "Your learning resources in one place.")}
            </p>

            <div class="card-bottom">
                <span class="subject-pill">${escapeHTML(item.subject)}</span>
                <span class="resource-count">
                    ${item.resources.length}
                    ${item.resources.length === 1 ? "resource" : "resources"}
                </span>
            </div>

            <div class="card-footer">
                <span>Updated ${formatDate(item.updatedAt)}</span>
                <button class="open-collection"
                        data-action="open"
                        data-id="${escapeHTML(item.id)}">
                    Open collection →
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function openModal(id = null) {
    editingId = id;
    lastFocusedElement = document.activeElement;

    form.reset();
    document.getElementById("formError").textContent = "";

    if (id) {
        const item = getCollection(id);
        if (!item) return;

        document.getElementById("modalTitle").textContent = "Edit Collection";
        document.getElementById("saveCollection").textContent = "Save Changes";
        document.getElementById("collectionName").value = item.name;
        document.getElementById("collectionSubject").value = item.subject;
        document.getElementById("collectionDescription").value = item.description;
    } else {
        document.getElementById("modalTitle").textContent = "New Collection";
        document.getElementById("saveCollection").textContent = "Create Collection";
    }

    modal.hidden = false;
    document.getElementById("collectionName").focus();
}

function closeModal() {
    modal.hidden = true;
    editingId = null;

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
    }
}

document.getElementById("createBtn").addEventListener("click", () => {
    openModal();
});

document.getElementById("emptyCreateBtn").addEventListener("click", () => {
    openModal();
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("collectionName").value.trim();
    const subject = document.getElementById("collectionSubject").value;
    const description =
        document.getElementById("collectionDescription").value.trim();

    const error = document.getElementById("formError");

    if (!name || !subject) {
        error.textContent = "Please enter a name and choose a subject.";
        return;
    }

    const duplicate = collections.some(item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== editingId
    );

    if (duplicate) {
        error.textContent = "A collection with this name already exists.";
        return;
    }

    const previous = editingId ? getCollection(editingId) : null;

    const item = {
        id: editingId || makeId(),
        name,
        subject,
        description,
        resources: previous ? previous.resources : [],
        createdAt: previous ? previous.createdAt : makeDate(),
        updatedAt: makeDate()
    };

    const previousCollections = [...collections];

    if (editingId) {
        collections = collections.map(existing =>
            existing.id === editingId ? item : existing
        );
    } else {
        collections.unshift(item);
    }

    if (!saveCollections()) {
        collections = previousCollections;
        return;
    }

    closeModal();
    renderCollections();
    showToast(editingId ? "Collection updated!" : "Collection created!");
});

grid.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const { action, id } = button.dataset;
    const item = getCollection(id);

    if (!item) return;

    if (action === "menu") {
        const menu = button.parentElement.querySelector(".card-menu");
        const shouldOpen = menu.hidden;

        document.querySelectorAll(".card-menu").forEach(element => {
            element.hidden = true;
        });

        document.querySelectorAll(".card-menu-btn").forEach(element => {
            element.setAttribute("aria-expanded", "false");
        });

        menu.hidden = !shouldOpen;
        button.setAttribute("aria-expanded", String(shouldOpen));
        return;
    }

    if (action === "open") {
        openDetails(id);
    }

    if (action === "edit") {
        openModal(id);
    }

    if (action === "delete") {
        deleteCollection(id);
    }
});

document.addEventListener("click", event => {
    if (!event.target.closest(".card-menu-wrap")) {
        document.querySelectorAll(".card-menu").forEach(menu => {
            menu.hidden = true;
        });

        document.querySelectorAll(".card-menu-btn").forEach(button => {
            button.setAttribute("aria-expanded", "false");
        });
    }
});

function deleteCollection(id) {
    const item = getCollection(id);
    if (!item) return;

    const confirmed = confirm(
        `Delete "${item.name}" and its saved resource entries?`
    );

    if (!confirmed) return;

    const previous = collections;
    collections = collections.filter(item => item.id !== id);

    if (!saveCollections()) {
        collections = previous;
        return;
    }

    if (activeCollectionId === id) {
        closeDetails();
    }

    renderCollections();
    showToast("Collection deleted.");
}

function openDetails(id) {
    const item = getCollection(id);
    if (!item) return;

    activeCollectionId = id;
    lastFocusedElement = document.activeElement;

    document.getElementById("detailTitle").textContent = item.name;
    document.getElementById("detailDescription").textContent =
        item.description || "No description added yet.";

    document.getElementById("detailSubject").textContent = item.subject;
    document.getElementById("detailResourceCount").textContent =
        item.resources.length + " resources";

    document.getElementById("resourceForm").hidden = true;
    document.getElementById("resourceForm").reset();

    renderResources(item);

    detailModal.hidden = false;
    document.getElementById("closeDetail").focus();
}

function closeDetails() {
    detailModal.hidden = true;
    activeCollectionId = null;

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
    }
}

document.getElementById("closeDetail").addEventListener("click", closeDetails);

detailModal.addEventListener("click", event => {
    if (event.target === detailModal) closeDetails();
});

document.getElementById("addResourceBtn").addEventListener("click", () => {
    const resourceForm = document.getElementById("resourceForm");
    resourceForm.hidden = !resourceForm.hidden;

    if (!resourceForm.hidden) {
        document.getElementById("resourceName").focus();
    }
});

document.getElementById("cancelResource").addEventListener("click", () => {
    const resourceForm = document.getElementById("resourceForm");
    resourceForm.reset();
    resourceForm.hidden = true;
});

document.getElementById("resourceForm").addEventListener("submit", event => {
    event.preventDefault();

    const item = getCollection(activeCollectionId);
    if (!item) return;

    const name = document.getElementById("resourceName").value.trim();
    const type = document.getElementById("resourceType").value;
    const rawLink = document.getElementById("resourceLink").value.trim();

    if (!name) {
        showToast("Please enter a resource title.");
        return;
    }

    let link = "";

    if (rawLink) {
        link = safeUrl(rawLink);

        if (!link) {
            showToast("Please enter a valid HTTP or HTTPS link.");
            return;
        }
    }

    const resource = {
        id: makeId(),
        name,
        type,
        link
    };

    item.resources.push(resource);
    item.updatedAt = makeDate();

    if (!saveCollections()) {
        item.resources.pop();
        return;
    }

    document.getElementById("resourceForm").reset();
    document.getElementById("resourceForm").hidden = true;

    renderResources(item);
    renderCollections();
    showToast("Resource added!");
});

function renderResources(item) {
    const list = document.getElementById("resourceList");

    document.getElementById("detailResourceCount").textContent =
        item.resources.length + " resources";

    list.innerHTML = "";

    if (item.resources.length === 0) {
        list.innerHTML = `
            <div class="resource-empty">
                <div style="font-size:25px;margin-bottom:8px;">▤</div>
                No resources yet.<br>
                Add your first note, link or document.
            </div>
        `;
        return;
    }

    item.resources.forEach(resource => {
        const row = document.createElement("div");
        row.className = "resource-item";

        const icon = resource.type === "Link" ? "↗"
            : resource.type === "Document" ? "▤"
            : resource.type === "Note" ? "✎" : "◇";

        const validLink = safeUrl(resource.link || "");

        row.innerHTML = `
            <div class="resource-icon">${icon}</div>
            <div class="resource-info">
                <strong>${escapeHTML(resource.name)}</strong>
                <small>${escapeHTML(resource.type)}</small>
            </div>
            <div class="resource-action">
                ${validLink
                    ? `<a href="${escapeHTML(validLink)}"
                           target="_blank" rel="noopener noreferrer">Open ↗</a>`
                    : ""}
                <button data-resource-delete="${escapeHTML(resource.id)}"
                        aria-label="Remove ${escapeHTML(resource.name)}">×</button>
            </div>
        `;

        list.appendChild(row);
    });
}

document.getElementById("resourceList").addEventListener("click", event => {
    const button = event.target.closest("[data-resource-delete]");
    if (!button) return;

    const item = getCollection(activeCollectionId);
    if (!item) return;

    const resourceId = button.dataset.resourceDelete;
    const resource = item.resources.find(item => item.id === resourceId);
    if (!resource) return;

    if (!confirm(`Remove "${resource.name}" from this collection?`)) return;

    const previous = item.resources;
    item.resources = item.resources.filter(item => item.id !== resourceId);
    item.updatedAt = makeDate();

    if (!saveCollections()) {
        item.resources = previous;
        return;
    }

    renderResources(item);
    renderCollections();
    showToast("Resource removed.");
});

searchInput.addEventListener("input", renderCollections);
subjectFilter.addEventListener("change", renderCollections);
sortSelect.addEventListener("change", renderCollections);

document.getElementById("clearSearch").addEventListener("click", () => {
    searchInput.value = "";
    renderCollections();
    searchInput.focus();
});

document.querySelectorAll(".view-btn").forEach(button => {
    button.addEventListener("click", () => {
        currentView = button.dataset.view;

        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        renderCollections();
    });
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
        if (!detailModal.hidden) {
            closeDetails();
        } else if (!modal.hidden) {
            closeModal();
        } else {
            sidebar.classList.remove("open");
            document.querySelectorAll(".card-menu").forEach(menu => {
                menu.hidden = true;
            });
        }
    }
});

renderCollections();
