// Shared script for login, register, and todos pages
const SERVER_URL = "https://todo-backend-9ybx.onrender.com";
const token = localStorage.getItem("token");

// Login page logic
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${SERVER_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      window.location.href = "todos.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Register page logic
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${SERVER_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Registration Successfull, Please Login!");
        window.location.href = "index.html";
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || "Registration Failed");
        });
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Todos page logic
function createTodoCard(todo) {
  const card = document.createElement("div");
  card.className = "todo-card";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.isCompleted;
  checkbox.addEventListener("chane", function () {
    const updatedTodo = { ...todo, isCompleted: checkbox.checked };
    updateTodoStatus(updatedTodo);
  });
  const span = document.createElement("span");
  span.textContent = todo.title;

  if (todo.isCompleted) {
    span.style.textDecoration = "line-through";
    span.style.color = "#aaa";
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = function () {
    deleteTodo(todo.id);
  };

  card.appendChild(checkbox);
  card.appendChild(span);
  card.appendChild(deleteBtn);

  return card;
}

function loadTodos() {
    if (!token) {
        alert("Please Login First");
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/api/todo`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }
        return response.json();
    })
    .then(todos => {
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        if (!todos || todos.length === 0) {
            todoList.innerHTML = `<p>No Todo yet. Add one below!</p>`;
        } else {
            todos.forEach(todo => {
                todoList.appendChild(createTodoCard(todo));
            });
        }
    })
    .catch((error) => {
      document.getElementById(
        "todo-list"
      ).innerHTML = `<p style="color:red">Failed to load Todos!</p>`;
    });
}


function addTodo() {
  const input = document.getElementById("new-todo");
  const todotext = input.value.trim();
  fetch(`${SERVER_URL}/api/todo/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: todotext, isCompleted: false }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to Add Todo");
      }
      return response.json();
    })
    .then((newTodo) => {
      input.value = "";
      loadTodos();
    })
    .catch((error) => {
      alert(error.message);
    });
}

function updateTodoStatus(todo) {
  fetch(`${SERVER_URL}/api/todo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(todo),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to Update Todo");
      }
      return response.json();
    })
    .then(() => loadTodos())
    .catch((error) => {
      alert(error.message);
    });
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/api/todo/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Failed to Delete Todo");
        }
        loadTodos();
    })
    .catch(error => alert(error.message));
}


// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("todo-list")) {
    loadTodos();
  }
});
