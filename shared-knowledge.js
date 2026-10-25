
const feed = document.getElementById("postFeed");
const postModal = document.getElementById("postModal");
const commentsModal = document.getElementById("commentsModal");
const postForm = document.getElementById("postForm");
const toast = document.getElementById("toast");

const POSTS_KEY = "mindshelf_knowledge_posts";
const LIKES_KEY = "mindshelf_knowledge_likes";
const SAVED_KEY = "mindshelf_knowledge_saved";
const COMMENTS_KEY = "mindshelf_knowledge_comments";

const demoPosts = [
    {
        id: "k101",
        title: "What is the difference between into and onto functions?",
        type: "Question",
        subject: "Discrete Mathematics",
        content: "I understand one-one functions, but I am confused about into and onto. Can someone explain the difference with a simple mapping example?",
        author: "Udita Sharma",
        date: new Date(Date.now() - 3600000).toISOString(),
        likes: 8
    },
    {
        id: "k102",
        title: "Understanding Linear Regression in simple words",
        type: "Explanation",
        subject: "Data Science",
        content: "Linear Regression predicts a continuous value by learning a relationship between input and output variables. For example, we can estimate house prices using area. The simple equation is y = mx + c, where m is the slope and c is the intercept.",
        author: "Akash Ghosh",
        date: new Date(Date.now() - 86400000).toISOString(),
        likes: 14
    },
    {
        id: "k103",
        title: "A small tip for writing cleaner CSS",
        type: "Study Tip",
        subject: "Web Development",
        content: "Use CSS variables for repeated colors, spacing and common design values. It makes your stylesheet easier to maintain and helps keep your project consistent.",
        author: "Bhavaya",
        date: new Date(Date.now() - 172800000).toISOString(),
        likes: 11
    },
    {
        id: "k104",
        title: "How do you stay consistent with exam revision?",
        type: "Question",
        subject: "Study Skills",
        content: "What revision methods work best for you when multiple exams are approaching? I would love to know how you manage practice questions and revision.",
        author: "Tanishq Sharma",
        date: new Date(Date.now() - 259200000).toISOString(),
        likes: 6
    }
];

function readArray(key, fallback = []) {
    try {
        const saved = localStorage.getItem(key);

        if (saved === null) return fallback;

        const data = JSON.parse(saved);
        return Array.isArray(data) ? data : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveArray(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        showToast("Couldn't save changes. Storage may be full.");
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

let posts = readArray(POSTS_KEY, demoPosts);
let likes = new Set(readArray(LIKES_KEY));
let savedPosts = new Set(readArray(SAVED_KEY));
let comments = readArray(COMMENTS_KEY);

let activeTab = "all";
let selectedPostId = null;
let currentFocus = null;
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function getPost(id) {
    return posts.find(post => post.id === id);
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Recently";

    const difference = Date.now() - date.getTime();

    if (difference < 60000) return "Just now";
    if (difference < 3600000) {
        return Math.floor(difference / 60000) + "m ago";
    }
    if (difference < 86400000) {
        return Math.floor(difference / 3600000) + "h ago";
    }
    if (difference < 604800000) {
        return Math.floor(difference / 86400000) + "d ago";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });
}

function updateStats() {
    document.getElementById("postCount").textContent = posts.length;

    document.getElementById("likeCount").textContent =
        posts.reduce((total, post) => total + (Number(post.likes) || 0), 0);

    document.getElementById("contributorCount").textContent =
        new Set(posts.map(post => post.author)).size;
}

function updateSubjects() {
    const select = document.getElementById("subjectFilter");
    const selected = select.value;

    const subjects = [...new Set(
        posts.map(post => post.subject)
    )].sort();

    select.innerHTML = '<option value="all">All subjects</option>';

    subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
    });

    if (subjects.includes(selected)) {
        select.value = selected;
    }
}

function getFilteredPosts() {
    const search = document.getElementById("topSearch")
        .value.trim().toLowerCase();

    const subject = document.getElementById("subjectFilter").value;
    const sort = document.getElementById("sortSelect").value;

    let result = posts.filter(post => {
        const matchesSearch = [
            post.title,
            post.content,
            post.subject,
            post.author,
            post.type
        ].some(value =>
            String(value).toLowerCase().includes(search)
        );

        const matchesSubject =
            subject === "all" || post.subject === subject;

        let matchesTab = true;

        if (activeTab === "questions") {
            matchesTab = post.type === "Question";
        }

        if (activeTab === "explanations") {
            matchesTab = post.type === "Explanation";
        }

        if (activeTab === "saved") {
            matchesTab = savedPosts.has(post.id);
        }

        return matchesSearch && matchesSubject && matchesTab;
    });

    if (sort === "popular") {
        result.sort((a, b) => b.likes - a.likes);
    } else {
        result.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );
    }

    return result;
}

function renderTopics() {
    const topicList = document.getElementById("topicList");
    const counts = {};

    posts.forEach(post => {
        counts[post.subject] = (counts[post.subject] || 0) + 1;
    });

    const subjects = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    topicList.innerHTML = "";

    if (!subjects.length) {
        topicList.textContent = "No topics yet.";
        return;
    }

    subjects.forEach(([subject, count]) => {
        const button = document.createElement("button");
        button.className = "topic-btn";

        button.innerHTML = `
            <span>${escapeHTML(subject)}</span>
            <span>${count}</span>
        `;

        button.addEventListener("click", () => {
            document.getElementById("subjectFilter").value = subject;
            renderPosts();

            document.getElementById("discussionSection").scrollIntoView({
                behavior: "smooth"
            });
        });

        topicList.appendChild(button);
    });
}

function renderPosts() {
    updateStats();
    updateSubjects();
    renderTopics();

    const items = getFilteredPosts();

    feed.innerHTML = "";

    document.getElementById("resultsCount").textContent =
        `${items.length} ${items.length === 1 ? "post" : "posts"}`;

    document.getElementById("feedCount").textContent =
        items.length + " results";

    document.getElementById("feedTitle").textContent =
        activeTab === "saved" ? "Saved knowledge" :
        activeTab === "questions" ? "Community questions" :
        activeTab === "explanations" ? "Concept explanations" :
        "Latest discussions";

    document.getElementById("emptyState").hidden = items.length !== 0;
    feed.hidden = items.length === 0;

    items.forEach(post => {
        const card = document.createElement("article");
        card.className = "post-card";

        const isLiked = likes.has(post.id);
        const isSaved = savedPosts.has(post.id);

        const tagClass =
            post.type === "Question" ? "question" :
            post.type === "Study Tip" ? "tip" : "";

        const replyCount = comments.filter(
            comment => comment.postId === post.id
        ).length;

        card.innerHTML = `
            <div class="post-meta">
                <div class="post-avatar">
                    ${escapeHTML(post.author.charAt(0).toUpperCase())}
                </div>

                <div>
                    <div class="post-author">${escapeHTML(post.author)}</div>
                    <span class="post-date">${formatDate(post.date)}</span>
                </div>

                <span class="post-tag ${tagClass}">
                    ${escapeHTML(post.type)}
                </span>
            </div>

            <h3>${escapeHTML(post.title)}</h3>

            <p class="post-content">${escapeHTML(post.content)}</p>

            <span class="post-subject">
                ◈ ${escapeHTML(post.subject)}
            </span>

            <div class="post-actions">
                <button class="action-btn ${isLiked ? "liked" : ""}"
                        data-like="${escapeHTML(post.id)}"
                        aria-pressed="${isLiked}">
                    ${isLiked ? "♥ Liked" : "♡ Like"} · ${post.likes}
                </button>

                <button class="action-btn"
                        data-comment="${escapeHTML(post.id)}">
                    ◯ Discuss · ${replyCount}
                </button>

                <button class="action-btn ${isSaved ? "saved" : ""}"
                        data-save="${escapeHTML(post.id)}"
                        aria-pressed="${isSaved}">
                    ${isSaved ? "✓ Saved" : "⚑ Save"}
                </button>
            </div>
        `;

        feed.appendChild(card);
    });
}

feed.addEventListener("click", event => {
    const likeButton = event.target.closest("[data-like]");
    const saveButton = event.target.closest("[data-save]");
    const commentButton = event.target.closest("[data-comment]");

    if (likeButton) {
        toggleLike(likeButton.dataset.like);
    }

    if (saveButton) {
        toggleSave(saveButton.dataset.save);
    }

    if (commentButton) {
        openComments(commentButton.dataset.comment);
    }
});

function toggleLike(id) {
    const post = getPost(id);
    if (!post) return;

    const wasLiked = likes.has(id);
    const previousLikes = post.likes;

    if (wasLiked) {
        likes.delete(id);
        post.likes = Math.max(0, post.likes - 1);
    } else {
        likes.add(id);
        post.likes++;
    }

    if (!saveArray(LIKES_KEY, [...likes]) ||
        !saveArray(POSTS_KEY, posts)) {
        if (wasLiked) {
            likes.add(id);
        } else {
            likes.delete(id);
        }

        post.likes = previousLikes;
        return;
    }

    renderPosts();
}

function toggleSave(id) {
    if (!getPost(id)) return;

    const previous = new Set(savedPosts);

    if (savedPosts.has(id)) {
        savedPosts.delete(id);
    } else {
        savedPosts.add(id);
    }

    if (!saveArray(SAVED_KEY, [...savedPosts])) {
        savedPosts = previous;
        return;
    }

    renderPosts();

    showToast(savedPosts.has(id) ? "Post saved!" : "Post removed from saved.");
}

function openPostModal() {
    currentFocus = document.activeElement;
    postForm.reset();

    document.getElementById("charCount").textContent = "0 / 3000";
    document.getElementById("formError").textContent = "";

    postModal.hidden = false;
    document.getElementById("postTitle").focus();
}

function closePostModal() {
    postModal.hidden = true;

    if (currentFocus && document.contains(currentFocus)) {
        currentFocus.focus();
    }
}

document.getElementById("openPost").addEventListener("click", openPostModal);
document.getElementById("emptyPost").addEventListener("click", openPostModal);
document.getElementById("tipPost").addEventListener("click", openPostModal);

document.getElementById("closePost").addEventListener("click", closePostModal);
document.getElementById("cancelPost").addEventListener("click", closePostModal);

postModal.addEventListener("click", event => {
    if (event.target === postModal) closePostModal();
});

document.getElementById("postContent").addEventListener("input", event => {
    document.getElementById("charCount").textContent =
        `${event.target.value.length} / 3000`;
});

postForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const subject = document.getElementById("postSubject").value.trim();
    const type = document.getElementById("postType").value;
    const content = document.getElementById("postContent").value.trim();
    const error = document.getElementById("formError");

    error.textContent = "";

    if (!title || !subject || !content) {
        error.textContent = "Please fill in all fields.";
        return;
    }

    const post = {
        id: Date.now().toString(36) +
            Math.random().toString(36).slice(2, 7),
        title,
        type,
        subject,
        content,
        author: "Bhavaya",
        date: new Date().toISOString(),
        likes: 0
    };

    posts.unshift(post);

    if (!saveArray(POSTS_KEY, posts)) {
        posts.shift();
        return;
    }

    closePostModal();

    document.getElementById("topSearch").value = "";
    document.getElementById("subjectFilter").value = "all";
    document.getElementById("sortSelect").value = "newest";

    activeTab = "all";

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === "all");
    });

    renderPosts();
    showToast("Your knowledge post was published!");
});

function openComments(id) {
    const post = getPost(id);
    if (!post) return;

    selectedPostId = id;
    currentFocus = document.activeElement;

    document.getElementById("commentPostTitle").textContent = post.title;
    document.getElementById("commentInput").value = "";
    document.getElementById("commentError").textContent = "";

    renderComments();

    commentsModal.hidden = false;
    document.getElementById("commentInput").focus();
}

function renderComments() {
    const list = document.getElementById("commentList");

    const postComments = comments.filter(
        comment => comment.postId === selectedPostId
    );

    list.innerHTML = "";

    if (postComments.length === 0) {
        list.innerHTML =
            '<p class="comment-empty">No replies yet. Start the discussion!</p>';
        return;
    }

    postComments.forEach(comment => {
        const item = document.createElement("div");
        item.className = "comment-item";

        item.innerHTML = `
            <strong>${escapeHTML(comment.author)}</strong>
            <p>${escapeHTML(comment.content)}</p>
            <span class="post-date">${formatDate(comment.date)}</span>
        `;

        list.appendChild(item);
    });
}

function closeComments() {
    commentsModal.hidden = true;
    selectedPostId = null;

    if (currentFocus && document.contains(currentFocus)) {
        currentFocus.focus();
    }
}

document.getElementById("closeComments").addEventListener("click", closeComments);

commentsModal.addEventListener("click", event => {
    if (event.target === commentsModal) closeComments();
});

document.getElementById("commentForm").addEventListener("submit", event => {
    event.preventDefault();

    const content = document.getElementById("commentInput").value.trim();
    const error = document.getElementById("commentError");

    error.textContent = "";

    if (!content || !selectedPostId) {
        error.textContent = "Write a reply first.";
        return;
    }

    const comment = {
        id: Date.now().toString(36),
        postId: selectedPostId,
        author: "Bhavaya",
        content,
        date: new Date().toISOString()
    };

    comments.push(comment);

    if (!saveArray(COMMENTS_KEY, comments)) {
        comments.pop();
        return;
    }

    document.getElementById("commentInput").value = "";

    renderComments();
    renderPosts();
    showToast("Reply added!");
});

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        activeTab = button.dataset.tab;

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.toggle("active", tab === button);
        });

        renderPosts();
    });
});

document.getElementById("topSearch").addEventListener("input", renderPosts);
document.getElementById("subjectFilter").addEventListener("change", renderPosts);
document.getElementById("sortSelect").addEventListener("change", renderPosts);

document.getElementById("exploreBtn").addEventListener("click", () => {
    document.getElementById("discussionSection").scrollIntoView({
        behavior: "smooth"
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
        if (!postModal.hidden) closePostModal();
        else if (!commentsModal.hidden) closeComments();
        else sidebar.classList.remove("open");
    }
});

renderPosts();
