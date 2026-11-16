const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text) {
  tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function editTask(id, newText) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, text: newText } : task
  );
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function renderTasks() {
  list.innerHTML = "";
  const filtered = getFilteredTasks();

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => startEditing(li, task));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, editBtn, deleteBtn);
    list.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  count.textContent = `${remaining} task(s) remaining`;
}

function startEditing(li, task) {
  li.innerHTML = "";

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = task.text;
  editInput.className = "edit-input";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";

  const save = () => {
    const newText = editInput.value.trim();
    if (newText) editTask(task.id, newText);
    else renderTasks();
  };

  saveBtn.addEventListener("click", save);
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") renderTasks();
  });

  li.append(editInput, saveBtn);
  editInput.focus();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = "";
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
