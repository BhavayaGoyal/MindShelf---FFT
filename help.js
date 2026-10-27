
const faqItems = document.querySelectorAll(".faq-item");
const faqSearch = document.getElementById("faqSearch");
const noResults = document.getElementById("noResults");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const arrow = item.querySelector(".faq-arrow");

  question.addEventListener("click", () => {
    const isOpen = question.getAttribute("aria-expanded") === "true";

    question.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;
    arrow.textContent = isOpen ? "＋" : "−";
  });
});

faqSearch.addEventListener("input", () => {
  const search = faqSearch.value.toLowerCase().trim();
  let visibleCount = 0;

  faqItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    const matches = text.includes(search);

    item.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  noResults.hidden = visibleCount !== 0;
});

const supportForm = document.getElementById("supportForm");
const formMessage = document.getElementById("formMessage");

supportForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("supportName").value.trim();
  const email = document.getElementById("supportEmail").value.trim();
  const topic = document.getElementById("supportTopic").value;
  const message = document.getElementById("supportMessage").value.trim();

  if (!name || !email || !topic || !message) {
    formMessage.textContent = "Please complete all the required fields.";
    return;
  }

  const requestText =
    "MindShelf Support Request\n\n" +
    "Name: " + name + "\n" +
    "Email: " + email + "\n" +
    "Category: " + topic + "\n\n" +
    "Issue:\n" + message;

  const blob = new Blob([requestText], {
    type: "text/plain"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "MindShelf-Support-Request.txt";
  link.click();

  URL.revokeObjectURL(url);

  formMessage.textContent =
    "Your support request has been prepared as a text file. " +
    "It has not been sent. Please share it with your support team.";

  supportForm.reset();
});
