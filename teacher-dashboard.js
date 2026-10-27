
const reviewList = document.getElementById("reviewList");
const reviewBadge = document.getElementById("reviewBadge");
const totalPending = document.getElementById("totalPending");

let reviews = [
  { id: 1, student: "Riya Mehta", task: "Python Assignment", date: "Today" },
  { id: 2, student: "Arjun Verma", task: "ML Model Report", date: "Today" },
  { id: 3, student: "Priya Shah", task: "Data Analysis Task", date: "Yesterday" },
  { id: 4, student: "Kabir Singh", task: "UI/UX Case Study", date: "Yesterday" }
];

let completed = Number(localStorage.getItem("teacherCompleted")) || 0;

const modal = document.getElementById("actionModal");
const form = document.getElementById("actionForm");
const nameInput = document.getElementById("actionName");
const detailsInput = document.getElementById("actionDetails");
const title = document.getElementById("modalTitle");
const description = document.getElementById("modalDescription");
const actionLabel = document.getElementById("actionLabel");
const toast = document.getElementById("toast");

let currentAction = "";
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;

  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

function renderReviews() {
  reviewList.innerHTML = "";

  reviews.forEach(review => {
    const item = document.createElement("div");
    item.className = "review-item";

    const info = document.createElement("div");
    const student = document.createElement("h3");
    const task = document.createElement("p");

    student.textContent = review.student;
    task.textContent = review.task + " · " + review.date;
    info.append(student, task);

    const button = document.createElement("button");
    button.className = "review-btn";
    button.textContent = "Reviewed";

    button.onclick = () => {
      reviews = reviews.filter(r => r.id !== review.id);
      completed++;
      localStorage.setItem("teacherCompleted", completed);
      renderReviews();
      showToast("Marked as reviewed in this demo.");
    };

    item.append(info, button);
    reviewList.appendChild(item);
  });

  const pending = reviews.length + 8;
  totalPending.textContent = pending;
  reviewBadge.textContent = pending + " pending";

  if (reviews.length === 0) {
    const message = document.createElement("p");
    message.className = "helper-text";
    message.textContent = "All demo review items are completed!";
    reviewList.appendChild(message);
  }
}

function openModal(action) {
  currentAction = action;
  form.reset();

  const settings = {
    "Upload Resource": {
      heading: "Upload Learning Resource",
      description: "Add a resource title and description.",
      label: "Resource Title",
      placeholder: "e.g. Machine Learning Notes"
    },
    "Create Assignment": {
      heading: "Create Assignment",
      description: "Add an assignment for your students.",
      label: "Assignment Title",
      placeholder: "e.g. Python Practice Task"
    },
    "Post Announcement": {
      heading: "New Announcement",
      description: "Share an update with your students.",
      label: "Announcement Title",
      placeholder: "e.g. Upcoming Class Test"
    },
    "Add Class": {
      heading: "Add Class",
      description: "Create a class entry for this demo.",
      label: "Class Name",
      placeholder: "e.g. Database Systems"
    }
  };

  const data = settings[action];

  title.textContent = data.heading;
  description.textContent = data.description;
  actionLabel.textContent = data.label;
  nameInput.placeholder = data.placeholder;
  modal.hidden = false;
  nameInput.focus();
}

function closeModal() {
  modal.hidden = true;
}

document.querySelectorAll("[data-action]").forEach(button => {
  button.addEventListener("click", () => {
    openModal(button.dataset.action);
  });
});

document.getElementById("closeModal").onclick = closeModal;
document.getElementById("cancelModal").onclick = closeModal;
document.getElementById("modalOverlay").onclick = closeModal;

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

form.addEventListener("submit", event => {
  event.preventDefault();

  const itemName = nameInput.value.trim();
  const details = detailsInput.value.trim();

  if (!itemName) return;

  if (currentAction === "Post Announcement") {
    const list = document.getElementById("announcementList");
    const item = document.createElement("div");
    item.className = "announcement-item";

    const dot = document.createElement("span");
    dot.className = "announcement-dot";

    const content = document.createElement("div");
    const heading = document.createElement("h3");
    const text = document.createElement("p");

    heading.textContent = itemName;
    text.textContent = details || "New teacher announcement";

    content.append(heading, text);
    item.append(dot, content);
    list.prepend(item);

    saveEntry("teacherAnnouncements", {
      title: itemName,
      details: details
    });
  }

  if (currentAction === "Upload Resource") {
    saveEntry("teacherResources", {
      title: itemName,
      details: details
    });
    document.getElementById("totalResources").textContent =
      Number(document.getElementById("totalResources").textContent) + 1;
  }

  if (currentAction === "Create Assignment") {
    saveEntry("teacherAssignments", {
      title: itemName,
      details: details
    });

    addActivity("New assignment created: " + itemName);
  }

  if (currentAction === "Add Class") {
    saveEntry("teacherClasses", {
      title: itemName,
      details: details
    });

    document.getElementById("totalClasses").textContent =
      Number(document.getElementById("totalClasses").textContent) + 1;
  }

  closeModal();
  showToast(currentAction + " saved in this demo.");
});

function saveEntry(key, entry) {
  const entries = JSON.parse(localStorage.getItem(key)) || [];
  entries.unshift(entry);
  localStorage.setItem(key, JSON.stringify(entries));
}

function addActivity(message) {
  const list = document.getElementById("activityList");
  const item = document.createElement("div");
  item.className = "activity-item";

  const dot = document.createElement("span");
  dot.className = "activity-dot";

  const content = document.createElement("div");
  const text = document.createElement("p");
  const time = document.createElement("small");

  text.textContent = message;
  time.textContent = "Just now";

  content.append(text, time);
  item.append(dot, content);
  list.prepend(item);
}

document.getElementById("notificationBtn").onclick = () => {
  showToast("You have " + (reviews.length + 8) + " pending demo reviews.");
};

renderReviews();
