// Check if user is logged in
if (
  localStorage.username === window.user_credentials.username &&
  localStorage.password === window.user_credentials.password
) {
  window.location.replace("./index.html");
}

const form = document.querySelector(".login-form");
const error_message = document.getElementById("error-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const [username, password] = [
    document.getElementById("username").value,
    document.getElementById("password").value,
  ];
  form.classList.toggle("form-error", false);
  error_message.classList.toggle("hide", true);
  if (
    username !== window.user_credentials.username ||
    password !== window.user_credentials.password
  ) {
    form.classList.toggle("form-error", true);
    error_message.classList.toggle("hide", false);
    return;
  }
  document.getElementById("success-message").classList.remove("hide");
  document
    .querySelector('button[type="submit"]')
    .setAttribute("disabled", true);

  localStorage.setItem("username", username);
  localStorage.setItem("password", password);

  setTimeout(() => {
    window.location.replace("./index.html");
  }, 5000);
});
