BASE_API_URL = "http://localhost:8000";

const getLoggedInUser = () => {
  const storedUserId = localStorage.userId;
  if (storedUserId) {
    return storedUserId;
  }
  return false;
};

const isLoggedIn = getLoggedInUser() ? true : false;

document.querySelector(".logout-link")?.addEventListener("click", () => {
  localStorage.removeItem("userId");
  window.location.replace("../pages/login.html");
});
