const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

window.addEventListener("load", () => {
    tasks.forEach(task => addTaskToDOM(task));
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (!taskText) return alert("Please enter a task.");

    const task = { text: taskText, completed: false };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    addTaskToDOM(task);
    input.value = "";
});

function addTaskToDOM(task) {
    const li = document.createElement("li");

    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="delete">X</button>
      `;
    list.appendChild(li);

    li.querySelector(".task-text").addEventListener("click", () => {
        li.classList.toggle("completed");
        const index = tasks.findIndex(t => t.text === task.text);
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    li.querySelector(".delete").addEventListener("click", () => {
        li.remove();
        tasks = tasks.filter(t => t.text !== task.text);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });
}