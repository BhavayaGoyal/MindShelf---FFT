
const assignmentList = document.getElementById("assignmentList");
const submitModal = document.getElementById("submitModal");
const submissionForm = document.getElementById("submissionForm");
const toast = document.getElementById("toast");

const STORAGE_KEY = "mindshelf_submissions";

function daysFromNow(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(23, 59, 0, 0);
    return date.toISOString();
}

const demoTasks = [
    {
        id: "a101",
        title: "Linear Regression Analysis",
        subject: "Data Science",
        type: "Assignment",
        description: "Build a simple regression model and explain your findings.",
        deadline: daysFromNow(2),
        status: "pending",
        added: 1,
        grade: "",
        feedback: ""
    },
    {
        id: "a102",
        title: "Discrete Mathematics Problem Set",
        subject: "Mathematics",
        type: "Assignment",
        description: "Solve the assigned problems on functions and relations.",
        deadline: daysFromNow(4),
        status: "pending",
        added: 2,
        grade: "",
        feedback: ""
    },
    {
        id: "a103",
        title: "UI/UX Prototype",
        subject: "UI/UX Design",
        type: "Project",
        description: "Submit your interactive Figma prototype and design explanation.",
        deadline: daysFromNow(6),
        status: "submitted",
        added: 3,
        grade: "",
        feedback: "",
        submission: {
            method: "link",
            link: "https://www.figma.com/",
            note: "Prototype submitted."
        }
    },
    {
        id: "a104",
        title: "HTML and CSS Practical",
        subject: "Web Development",
        type: "Practical",
        description: "Create a responsive webpage using HTML and CSS.",
        deadline: daysFromNow(-2),
        status: "reviewed",
        added: 4,
        grade: "18/20",
        feedback: "Good layout and responsive design. Improve accessibility and form labels.",
        reviewedAt: new Date().toISOString()
    },
    {
        id: "a105",
        title: "Statistical Case Study",
        subject: "Mathematics",
        type: "Project",
        description: "Analyze your dataset and present the statistical findings.",
        deadline: daysFromNow(1),
        status: "pending",
        added: 5,
        grade: "",
        feedback: ""
    }
];

function readTasks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTasks));
            return demoTasks;
        }

        const data = JSON.parse(saved);

        if (!Array.isArray(data)) return demoTasks;

        return data;
    } catch (error) {
        return demoTasks;
    }
}

let tasks = readTasks();
let activeFilter = "all";
let selectedTaskId = null;
let toastTimer;

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        showToast("Could not save. Browser storage may be full.");
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

function getStatus(task) {
    if (task.status === "reviewed") return "reviewed";
    if (task.status === "submitted") return "submitted";

    if (new Date(task.deadline).getTime() < Date.now()) {
        return "overdue";
    }

    return "pending";
}

function formatDeadline(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function deadlineLabel(task) {
    const status = getStatus(task);

    if (status === "reviewed") return "Reviewed";
    if (status === "submitted") return "Submitted for review";

    const remaining = new Date(task.deadline).getTime() - Date.now();

    if (remaining < 0) return "Deadline passed";

    const days = Math.ceil(remaining / 86400000);

    if (days === 1) return "Due within 24 hours";
    if (days <= 3) return `Due in ${days} days`;

    return "Deadline upcoming";
}

function updateStats() {
    const pending = tasks.filter(task =>
        getStatus(task) === "pending" ||
        getStatus(task) === "overdue"
    ).length;

    const submitted = tasks.filter(task =>
        task.status === "submitted"
    ).length;

    const reviewed = tasks.filter(task =>
        task.status === "reviewed"
    ).length;

    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("submittedCount").textContent = submitted;
    document.getElementById("reviewedCount").textContent = reviewed;

    const completed = submitted + reviewed;
    const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    document.getElementById("progressText").textContent = progress + "%";
    document.getElementById("progressFill").style.width = progress + "%";
}

function renderAssignments() {
    updateStats();

    const search = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    const sort = document.getElementById("sortSelect").value;

    let filtered = tasks.filter(task => {
        const status = getStatus(task);

        const matchesSearch = [
            task.title,
            task.subject,
            task.type,
            task.description
        ].some(value =>
            String(value || "").toLowerCase().includes(search)
        );

        let matchesFilter = true;

        if (activeFilter === "pending") {
            matchesFilter = status === "pending" || status === "overdue";
        }

        if (activeFilter === "submitted") {
            matchesFilter = status === "submitted";
        }

        if (activeFilter === "reviewed") {
            matchesFilter = status === "reviewed";
        }

        return matchesSearch && matchesFilter;
    });

    if (sort === "deadline") {
        filtered.sort((a, b) =>
            new Date(a.deadline) - new Date(b.deadline)
        );
    } else if (sort === "newest") {
        filtered.sort((a, b) => b.added - a.added);
    } else {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    assignmentList.innerHTML = "";

    document.getElementById("assignmentCount").textContent =
        `${filtered.length} ${filtered.length === 1 ? "task" : "tasks"}`;

    document.getElementById("emptyState").hidden = filtered.length !== 0;
    assignmentList.hidden = filtered.length === 0;

    filtered.forEach(task => {
        const status = getStatus(task);

        const card = document.createElement("article");
        card.className = "assignment-card";

        let actionHTML = "";

        if (status === "pending" || status === "overdue") {
            actionHTML = `
                <button class="primary-btn" data-submit="${escapeHTML(task.id)}">
                    Submit work ↗
                </button>
            `;
        } else if (status === "submitted") {
            actionHTML = `
                <button class="outline-btn" data-view="${escapeHTML(task.id)}">
                    View submission
                </button>
            `;
        } else {
            actionHTML = `
                <span class="task-grade">
                    ${escapeHTML(task.grade || "Reviewed")}
                </span>
                <button class="outline-btn" data-feedback="${escapeHTML(task.id)}">
                    View feedback
                </button>
            `;
        }

        const statusLabel = {
            pending: "Pending",
            overdue: "Overdue",
            submitted: "Submitted",
            reviewed: "Reviewed"
        }[status];

        card.innerHTML = `
            <div class="task-info">
                <div class="task-top">
                    <span class="subject-tag">
                        ${escapeHTML(task.subject)}
                    </span>
                    <span class="type-tag">
                        ${escapeHTML(task.type)}
                    </span>
                    <span class="status ${status}">
                        ${statusLabel}
                    </span>
                </div>

                <h3>${escapeHTML(task.title)}</h3>

                <p class="task-description">
                    ${escapeHTML(task.description)}
                </p>

                <div class="task-details">
                    <span>▦ ${formatDeadline(task.deadline)}</span>
                    <span>◷ ${deadlineLabel(task)}</span>
                </div>
            </div>

            <div class="task-actions">
                ${actionHTML}
            </div>
        `;

        assignmentList.appendChild(card);
    });

    renderFeedback();
}

function renderFeedback() {
    const feedbackList = document.getElementById("feedbackList");

    const reviewedTasks = tasks.filter(task =>
        task.status === "reviewed"
    );

    feedbackList.innerHTML = "";

    if (!reviewedTasks.length) {
        feedbackList.innerHTML = `
            <div class="feedback-card">
                <h3>No feedback yet</h3>
                <p>
                    Your reviewed assignments and teacher feedback
                    will appear here.
                </p>
            </div>
        `;
        return;
    }

    reviewedTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "feedback-card";

        card.innerHTML = `
            <span class="eyebrow">REVIEWED WORK</span>
            <h3>${escapeHTML(task.title)}</h3>
            <div class="grade">${escapeHTML(task.grade || "Reviewed")}</div>
            <p>${escapeHTML(task.feedback || "No written feedback provided.")}</p>
            <span class="feedback-date">
                ${task.reviewedAt ? formatDeadline(task.reviewedAt) : ""}
            </span>
        `;

        feedbackList.appendChild(card);
    });
}

function openSubmitModal(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) return;

    selectedTaskId = id;

    document.getElementById("modalTaskTitle").textContent = task.title;
    document.getElementById("modalTaskSubject").textContent = task.subject;
    document.getElementById("modalTaskDeadline").textContent =
        "Deadline: " + formatDeadline(task.deadline);

    submissionForm.reset();

    document.getElementById("linkField").hidden = false;
    document.getElementById("fileField").hidden = true;
    document.getElementById("submissionLink").required = true;
    document.getElementById("submissionFile").required = false;
    document.getElementById("formError").textContent = "";

    submitModal.hidden = false;
    document.getElementById("submissionType").focus();
}

function closeModal() {
    submitModal.hidden = true;
    selectedTaskId = null;
}

assignmentList.addEventListener("click", event => {
    const submitButton = event.target.closest("[data-submit]");
    const viewButton = event.target.closest("[data-view]");
    const feedbackButton = event.target.closest("[data-feedback]");

    if (submitButton) {
        openSubmitModal(submitButton.dataset.submit);
    }

    if (viewButton) {
        const task = tasks.find(item => item.id === viewButton.dataset.view);

        if (task && task.submission) {
            const details = task.submission.method === "file"
                ? `File: ${task.submission.fileName || "Selected file"}`
                : `Link: ${task.submission.link || "Not provided"}`;

            alert(
                `Submission: ${task.title}\n\n` +
                `${details}\n\n` +
                `Note: ${task.submission.note || "No note"}\n\n` +
                `Submitted: ${formatDeadline(task.submission.date)}`
            );
        }
    }

    if (feedbackButton) {
        const task = tasks.find(item =>
            item.id === feedbackButton.dataset.feedback
        );

        if (task) {
            alert(
                `Feedback: ${task.title}\n\n` +
                `Grade: ${task.grade || "Reviewed"}\n\n` +
                `${task.feedback || "No written feedback."}`
            );
        }
    }
});

document.getElementById("submissionType").addEventListener("change", event => {
    const isFile = event.target.value === "file";

    document.getElementById("linkField").hidden = isFile;
    document.getElementById("fileField").hidden = !isFile;

    document.getElementById("submissionLink").required = !isFile;
    document.getElementById("submissionFile").required = isFile;
});

submissionForm.addEventListener("submit", event => {
    event.preventDefault();

    const task = tasks.find(item => item.id === selectedTaskId);
    const error = document.getElementById("formError");

    error.textContent = "";

    if (!task) {
        error.textContent = "Assignment not found.";
        return;
    }

    if (task.status === "submitted" || task.status === "reviewed") {
        error.textContent = "This assignment has already been submitted.";
        return;
    }

    const method = document.getElementById("submissionType").value;
    const note = document.getElementById("submissionNote").value.trim();

    let submission = {
        method,
        note,
        date: new Date().toISOString()
    };

    if (method === "link") {
        const link = document.getElementById("submissionLink").value.trim();

        try {
            const url = new URL(link);

            if (!["https:", "http:"].includes(url.protocol)) {
                throw new Error("Invalid URL");
            }

            submission.link = url.href;
        } catch (error) {
            document.getElementById("formError").textContent =
                "Please enter a valid HTTP or HTTPS link.";
            return;
        }
    } else {
        const file = document.getElementById("submissionFile").files[0];

        if (!file) {
            document.getElementById("formError").textContent =
                "Please choose a file.";
            return;
        }

        const allowedExtensions = [
            "pdf", "doc", "docx", "ppt", "pptx", "zip"
        ];

        const extension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            document.getElementById("formError").textContent =
                "Choose a PDF, Word, PowerPoint or ZIP file.";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            document.getElementById("formError").textContent =
                "File must be smaller than 10 MB.";
            return;
        }

        submission.fileName = file.name;
        submission.fileSize = file.size;
    }

    const previousStatus = task.status;
    const previousSubmission = task.submission;

    task.status = "submitted";
    task.submission = submission;

    if (!saveTasks()) {
        task.status = previousStatus;
        task.submission = previousSubmission;
        return;
    }

    closeModal();
    renderAssignments();

    showToast("Submission recorded successfully!");
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);

submitModal.addEventListener("click", event => {
    if (event.target === submitModal) closeModal();
});

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.toggle("active", tab === button);
        });

        renderAssignments();
    });
});

document.getElementById("searchInput").addEventListener("input", renderAssignments);
document.getElementById("sortSelect").addEventListener("change", renderAssignments);

document.getElementById("resetBtn").addEventListener("click", () => {
    activeFilter = "all";

    document.getElementById("searchInput").value = "";
    document.getElementById("sortSelect").value = "deadline";

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.filter === "all");
    });

    renderAssignments();
});

document.getElementById("calendarBtn").addEventListener("click", () => {
    const upcoming = tasks
        .filter(task =>
            task.status === "pending" &&
            new Date(task.deadline).getTime() >= Date.now()
        )
        .sort((a, b) =>
            new Date(a.deadline) - new Date(b.deadline)
        );

    if (!upcoming.length) {
        showToast("No upcoming pending deadlines.");
        return;
    }

    alert(
        "UPCOMING DEADLINES\n\n" +
        upcoming.map(task =>
            `${task.title}\n${formatDeadline(task.deadline)}`
        ).join("\n\n")
    );
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
        if (!submitModal.hidden) closeModal();
        else sidebar.classList.remove("open");
    }
});

renderAssignments();
