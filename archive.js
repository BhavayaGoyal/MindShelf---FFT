
let notes = JSON.parse(localStorage.getItem("archivedNotes")) || [
  { id: 1, title: "Machine Learning Basics", subject: "Data Science" },
  { id: 2, title: "Functions and Relations", subject: "Mathematics" },
  { id: 3, title: "JavaScript Fundamentals", subject: "Programming" }
];

function showNotes() {
  const list = document.getElementById("archiveList");
  const count = document.getElementById("count");
  const empty = document.getElementById("empty");

  list.innerHTML = "";
  count.textContent = notes.length + (notes.length === 1 ? " note" : " notes");
  empty.hidden = notes.length !== 0;

  notes.forEach(note => {
    const item = document.createElement("div");
    item.className = "archive-item";

    const info = document.createElement("div");
    info.className = "note-info";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const subject = document.createElement("p");
    subject.textContent = note.subject;

    const button = document.createElement("button");
    button.className = "restore";
    button.textContent = "↶ Restore";

    button.onclick = () => {
      notes = notes.filter(n => n.id !== note.id);
      localStorage.setItem("archivedNotes", JSON.stringify(notes));
      showNotes();
      alert("Note restored from archive!");
    };

    info.append(title, subject);
    item.append(info, button);
    list.appendChild(item);
  });
}

showNotes();
