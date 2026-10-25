
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

togglePassword.addEventListener("click", function () {
  const isHidden = password.type === "password";

  password.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Hide" : "Show";

  togglePassword.setAttribute(
    "aria-label",
    isHidden ? "Hide password" : "Show password"
  );

  togglePassword.setAttribute("aria-pressed", String(isHidden));
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  message.textContent = "";

  if (!loginForm.checkValidity()) {
    loginForm.reportValidity();
    return;
  }

  message.textContent = "Opening Student Dashboard...";

  window.location.href = "student-dashboard.html";
});
