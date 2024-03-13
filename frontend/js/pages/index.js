const todosContainer = document.querySelector(".todos");
const no_todos = document.querySelector(".no-todos");
const add_todo_form = document.querySelector(".add-todo-form");
const add_todo_button = document.querySelector(".add-todo-button");

// Check if user is not logged in
if (!isLoggedIn) {
  window.location.href = "./pages/login.html";
}

// Load stored todos
const getTodos = async () => {
  const response = await fetch(
    BASE_API_URL + `/CRUD/getTodos.php?userId=${getLoggedInUser()}`
  );
  const data = await response.json();
  return data;
};
getTodos().then((data) => {
  const todos = data.data;
  if (todos.length > 0) {
    no_todos.classList.toggle("hide", true);
    todos.forEach((todo) =>
      addToDo(todo.id, todo.value, todo.checked, todo.important)
    );
  }
});

function storeTodos(array) {
  localStorage.todos = JSON.stringify(array);
}

const createTodo = async (value = "", checked = false, important = false) => {
  const response = await fetch(BASE_API_URL + "/CRUD/createTodo.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value: value,
      checked: checked,
      important: important,
      userId: getLoggedInUser(),
    }),
  });
  const data = await response.json();
  return data;
};

add_todo_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".add-todo-form input");
  let important = false;
  if (input.value.slice(-1) == "!") {
    important = true;
  }
  createTodo(input.value, false, important).then((data) => {
    const id = data.data.id;
    addToDo(id, input.value, false, important);
    input.value = "";
  });
});

const addToDo = (todo_id, value = "", checked = false, important = false) => {
  if (value.trim() === "") {
    return;
  }
  const todo = document.createElement("div");
  todo.classList.add("todo");
  todo.dataset.id = todo_id;
  todo.id = `todo_${todo_id}`;
  if (checked) todo.classList.add("todo-done");
  if (important) todo.classList.add("todo-important");

  const check_icon = document.createElement("i");
  check_icon.classList.add("fa-solid", "fa-check", "checked-todo");
  check_icon.addEventListener("click", () => checkTodo(todo_id));

  const important_icon = document.createElement("i");
  important_icon.classList.add(
    "fa-solid",
    "fa-exclamation-circle",
    "emphasis-icn"
  );
  important_icon.addEventListener("click", () => emphasisTodo(todo_id));

  const todo_text = document.createElement("p");
  todo_text.innerText = value;
  todo_text.classList.add("todo-text");
  todo_text.addEventListener("click", () => checkTodo(todo_id));

  const trash_icon = document.createElement("i");
  trash_icon.classList.add("fa-solid", "fa-trash", "delete-todo");
  trash_icon.addEventListener("click", () => removeTodo(todo_id));

  todo.append(check_icon, important_icon, todo_text, trash_icon);
  todosContainer.appendChild(todo);

  no_todos.classList.toggle("hide", true);
};

function removeTodo(id) {
  document.getElementById(`todo_${id}`).remove();
  todos = todos.filter((todo) => todo.id !== id);
  storeTodos(todos);
  if (todos.length == 0) no_todos.classList.toggle("hide", false);
}

function checkTodo(id) {
  document.getElementById(`todo_${id}`).classList.toggle("todo-done");
  todos = todos.map((todo) =>
    todo.id === id
      ? {
          ...todo,
          checked: !todo.checked,
        }
      : todo
  );
  storeTodos(todos);
}

function emphasisTodo(id) {
  document.getElementById(`todo_${id}`).classList.toggle("todo-important");
  todos = todos.map((todo) =>
    todo.id === id
      ? {
          ...todo,
          important: !todo.important,
        }
      : todo
  );
  storeTodos(todos);
}

function deleteAll() {
  document.querySelectorAll(".todo").forEach((el) => el.remove());
  storeTodos([]);
  no_todos.classList.toggle("hide", false);
}

add_todo_button.addEventListener("click", () => {
  add_todo_form.classList.toggle("hide");
  document
    .querySelector(".add-todo-button .button-text-add")
    .classList.toggle("hide");
  document
    .querySelector(".add-todo-button .button-text-cancel")
    .classList.toggle("hide");
});
