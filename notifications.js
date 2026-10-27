
const STORAGE_KEY = "mindshelf_notifications";
const PREF_KEY = "mindshelf_notification_preferences";

const notificationList = document.getElementById("notificationList");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

let activeFilter = "all";
let activeCategory = "all";
let toastTimer;

const demoNotifications = [
    {
        id: "n1",
        title: "Assignment deadline approaching",
        message: "Your Linear Regression Analysis assignment is due soon. Make sure your work is ready.",
        category: "assignment",
        time: new Date(Date.now() - 30 * 60000).toISOString(),
        read: false
    },
    {
        id: "n2",
        title: "New community reply",
        message: "Someone replied to a discussion about Python data analysis in Shared Knowledge.",
        category: "community",
        time: new Date(Date.now() - 2 * 3600000).toISOString(),
        read: false
    },
    {
        id: "n3",
        title: "New study material shared",
        message: "A new set of Data Science study notes is available in the Resource Library.",
        category: "resource",
        time: new Date(Date.now() - 5 * 3600000).toISOString(),
        read: false
    },
    {
        id: "n4",
        title: "Submission recorded",
        message: "Your UI/UX Prototype submission has been recorded in this demo.",
        category: "assignment",
        time: new Date(Date.now() - 86400000).toISOString(),
        read: true
    },
    {
        id: "n5",
        title: "Welcome to MindShelf",
        message: "Organize your notes, discover resources and learn together with your community.",
        category: "system",
        time: new Date(Date.now() - 2 * 86400000).toISOString(),
        read: true
    },
    {
        id: "n6",
        title: "Community learning tip",
        message: "Sharing useful explanations can help other students understand difficult topics.",
        category: "community",
        time: new Date(Date.now() - 3 * 86400000).toISOString(),
        read: true
    }
];

function loadNotifications() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demoNotifications));
            return demoNotifications;
        }

        const data = JSON.parse(saved);

        return Array.isArray(data) ? data : demoNotifications;
    } catch (error) {
        return demoNotifications;
    }
}

let notifications = loadNotifications();

const defaultPreferences = {
    assignment: true,
    community: true,
    resource: true,
    system: true
};

function loadPreferences() {
    try {
        const saved = JSON.parse(localStorage.getItem(PREF_KEY));

        if (!saved || typeof saved !== "object") {
            return { ...defaultPreferences };
        }

        return {
            assignment: saved.assignment !== false,
            community: saved.community !== false,
            resource: saved.resource !== false,
            system: saved.system !== false
        };
    } catch (error) {
        return { ...defaultPreferences };
    }
}

let preferences = loadPreferences();

function saveNotifications() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        return true;
    } catch (error) {
        showToast("Unable to save changes.");
        return false;
    }
}

function savePreferenceData() {
    try {
        localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
        return true;
    } catch (error) {
        showToast("Unable to save preferences.");
        return false;
    }
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

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function formatTime(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    const difference = Date.now() - date.getTime();

    if (difference < 0) {
        return date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit"
        });
    }

    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);

    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function updateCount() {
    const unread = notifications.filter(item => !item.read).length;

    document.getElementById("unreadCount").textContent = unread;
    document.getElementById("markAllBtn").disabled = unread === 0;

    document.getElementById("markAllBtn").style.opacity =
        unread === 0 ? "0.55" : "1";
}

function getIcon(category) {
    const icons = {
        assignment: "◷",
        community: "♧",
        resource: "▤",
        system: "✦"
    };

    return icons[category] || "♢";
}

function renderNotifications() {
    const search = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    let filtered = notifications.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(search) ||
            item.message.toLowerCase().includes(search);

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "unread" && !item.read) ||
            (activeFilter === "read" && item.read);

        const matchesCategory =
            activeCategory === "all" ||
            item.category === activeCategory;

        return matchesSearch && matchesFilter && matchesCategory;
    });

    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));

    notificationList.innerHTML = "";

    document.getElementById("resultCount").textContent =
        `${filtered.length} ${filtered.length === 1 ? "notification" : "notifications"}`;

    emptyState.hidden = filtered.length > 0;
    notificationList.hidden = filtered.length === 0;

    filtered.forEach(item => {
        const element = document.createElement("article");

        element.className =
            "notification-item" + (!item.read ? " unread" : "");

        const actionLabel = item.read ? "Mark unread" : "Mark read";

        element.innerHTML = `
            <div class="notification-icon ${escapeHTML(item.category)}">
                ${getIcon(item.category)}
            </div>

            <div class="notification-content">
                <h3 class="notification-title">
                    ${escapeHTML(item.title)}
                </h3>

                <p class="notification-message">
                    ${escapeHTML(item.message)}
                </p>

                <span class="notification-time">
                    ${formatTime(item.time)}
                </span>
            </div>

            <div class="notification-actions">
                <button class="action-btn"
                    data-toggle="${escapeHTML(item.id)}">
                    ${actionLabel}
                </button>

                <button class="action-btn delete"
                    data-delete="${escapeHTML(item.id)}"
                    aria-label="Delete notification">
                    Delete
                </button>
            </div>
        `;

        notificationList.appendChild(element);
    });

    updateCount();
}

notificationList.addEventListener("click", event => {
    const toggleButton = event.target.closest("[data-toggle]");
    const deleteButton = event.target.closest("[data-delete]");

    if (toggleButton) {
        const item = notifications.find(
            notification => notification.id === toggleButton.dataset.toggle
        );

        if (!item) return;

        item.read = !item.read;

        if (!saveNotifications()) {
            item.read = !item.read;
            return;
        }

        renderNotifications();
        showToast(item.read ? "Marked as read." : "Marked as unread.");
    }

    if (deleteButton) {
        const id = deleteButton.dataset.delete;
        const index = notifications.findIndex(item => item.id === id);

        if (index === -1) return;

        const removed = notifications.splice(index, 1)[0];

        if (!saveNotifications()) {
            notifications.splice(index, 0, removed);
            return;
        }

        renderNotifications();
        showToast("Notification deleted.");
    }
});

document.getElementById("markAllBtn").addEventListener("click", () => {
    const previous = notifications.map(item => item.read);

    notifications.forEach(item => {
        item.read = true;
    });

    if (!saveNotifications()) {
        notifications.forEach((item, index) => {
            item.read = previous[index];
        });
        return;
    }

    renderNotifications();
    showToast("All notifications marked as read.");
});

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.toggle("active", tab === button);
        });

        renderNotifications();
    });
});

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        document.querySelectorAll(".category").forEach(category => {
            category.classList.toggle("active", category === button);
        });

        renderNotifications();
    });
});

document.getElementById("searchInput").addEventListener(
    "input",
    renderNotifications
);

document.getElementById("resetBtn").addEventListener("click", () => {
    activeFilter = "all";
    activeCategory = "all";

    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".tab").forEach(button => {
        button.classList.toggle("active", button.dataset.filter === "all");
    });

    document.querySelectorAll(".category").forEach(button => {
        button.classList.toggle("active", button.dataset.category === "all");
    });

    renderNotifications();
});

/* Preferences */

const preferencesModal = document.getElementById("preferencesModal");

function openPreferences() {
    document.getElementById("prefAssignment").checked = preferences.assignment;
    document.getElementById("prefCommunity").checked = preferences.community;
    document.getElementById("prefResource").checked = preferences.resource;
    document.getElementById("prefSystem").checked = preferences.system;

    preferencesModal.hidden = false;
}

function closePreferences() {
    preferencesModal.hidden = true;
}

document.getElementById("preferencesBtn").addEventListener(
    "click",
    openPreferences
);

document.getElementById("closePreferences").addEventListener(
    "click",
    closePreferences
);

document.getElementById("cancelPreferences").addEventListener(
    "click",
    closePreferences
);

preferencesModal.addEventListener("click", event => {
    if (event.target === preferencesModal) closePreferences();
});

document.getElementById("savePreferences").addEventListener("click", () => {
    const previous = { ...preferences };

    preferences = {
        assignment: document.getElementById("prefAssignment").checked,
        community: document.getElementById("prefCommunity").checked,
        resource: document.getElementById("prefResource").checked,
        system: document.getElementById("prefSystem").checked
    };

    if (!savePreferenceData()) {
        preferences = previous;
        return;
    }

    closePreferences();
    showToast("Preferences saved.");
});

/* Mobile sidebar */

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
        closePreferences();
        sidebar.classList.remove("open");
    }
});

renderNotifications();
