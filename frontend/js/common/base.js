BASE_API_URL = "http://localhost:8000";

const getLoggedInUser = () => {
  const storedUserId = localStorage.userId;
  const storedToken = localStorage.token;
  if (storedUserId && storedToken) {
    return {
      id: storedUserId,
      token: storedToken,
    };
  }
  return false;
};

const isLoggedIn = getLoggedInUser() ? true : false;

document.querySelector(".logout-link")?.addEventListener("click", () => {
  localStorage.removeItem("userId");
  window.location.replace("./pages/login.html");
});
