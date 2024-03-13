BASE_API_URL = "http://localhost:8000";

const isLoggedIn = localStorage.userId ? true : false;

document.querySelector(".logout-link")?.addEventListener("click", () => {
  localStorage.clear();
  window.location.replace("./login.html");
});
