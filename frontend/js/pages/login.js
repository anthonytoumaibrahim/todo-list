// Check if user is already logged in
if (isLoggedIn) {
  window.location.href = "../index.html";
}

const loginForm = document.querySelector(".login-form");
const loginBtn = document.querySelector(".login-form button");
const responseMessage = document.querySelector("#response-message");
const [usernameInput, passwordInput] = [
  document.getElementById("username"),
  document.getElementById("password"),
];

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  responseMessage.classList.remove("hide");
  responseMessage.innerHTML = "";

  const username = usernameInput.value;
  const password = passwordInput.value;

  login(username, password)
    .then((data) => {
      responseMessage.innerHTML = data?.message;
      responseMessage.classList.toggle("text-primary", data.status);
      responseMessage.classList.toggle("text-error", !data.status);

      if (data.status) {
        loginBtn.disabled = true;
        localStorage.userId = data.data.user_id;
        localStorage.token = data.data.token;
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 3000);
      }
    })
    .catch((err) => {
      responseMessage.classList.toggle("text-error", true);
      responseMessage.innerHTML = err;
    });
});

const login = async (username, password) => {
  const response = await fetch(BASE_API_URL + "/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = await response.json();

  return data;
};
