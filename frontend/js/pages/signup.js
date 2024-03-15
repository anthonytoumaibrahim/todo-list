// Check if user is already logged in
if (isLoggedIn) {
  window.location.href = "../index.html";
}

const signupForm = document.querySelector(".signup-form");
const signupBtn = document.querySelector(".signup-form button[type=submit]");
const responseMessage = document.querySelector("#response-message");
const [usernameInput, emailInput, passwordInput] = [
  document.getElementById("username"),
  document.getElementById("email"),
  document.getElementById("password"),
];

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  responseMessage.classList.remove("hide");
  responseMessage.innerHTML = "";
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  signup(username, email, password)
    .then((data) => {
      responseMessage.innerHTML = data?.message;
      responseMessage.classList.toggle("text-primary", data.status);
      responseMessage.classList.toggle("text-error", !data.status);

      if (data.status) {
        signupBtn.disabled = true;
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

const signup = async (username, email, password) => {
  const response = await fetch(BASE_API_URL + "/signup.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });
  const data = await response.json();

  return data;
};
