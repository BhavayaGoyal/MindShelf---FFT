
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");
const signupButton = document.getElementById("signupButton");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// Show or hide password
document.querySelectorAll(".show-password").forEach(function (button) {
  button.addEventListener("click", function () {
    const input = document.getElementById(button.dataset.target);
    const showPassword = input.type === "password";

    input.type = showPassword ? "text" : "password";
    button.textContent = showPassword ? "Hide" : "Show";

    button.setAttribute("aria-pressed", showPassword);
    button.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password"
    );
  });
});

// Check password confirmation
confirmPassword.addEventListener("input", function () {
  if (confirmPassword.value !== password.value) {
    confirmPassword.setCustomValidity("Passwords do not match.");
  } else {
    confirmPassword.setCustomValidity("");
  }
});

password.addEventListener("input", function () {
  if (confirmPassword.value !== password.value) {
    confirmPassword.setCustomValidity("Passwords do not match.");
  } else {
    confirmPassword.setCustomValidity("");
  }
});

// Registration form
signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  message.textContent = "";
  message.className = "message";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const passwordValue = password.value;
  const confirmValue = confirmPassword.value;
  const terms = document.getElementById("terms").checked;

  if (name.length < 2) {
    message.textContent = "Please enter your full name.";
    message.classList.add("error");
    return;
  }

  if (passwordValue.length < 8) {
    message.textContent = "Password must contain at least 8 characters.";
    message.classList.add("error");
    return;
  }

  if (passwordValue !== confirmValue) {
    message.textContent = "Passwords do not match.";
    message.classList.add("error");
    return;
  }

  if (!terms) {
    message.textContent = "Please accept the terms to continue.";
    message.classList.add("error");
    return;
  }

  // Demo only: no account is created yet.
  message.textContent =
    "Form validated. Connect the backend to create your account.";

  message.classList.add("success");

  console.log("Signup form validated for:", email);
});
