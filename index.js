const app = (() => {
    const taskList = document.getElementById("task-list");
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const clearCompletedButton = document.getElementById("clear-completed");
    const filterAllButton = document.getElementById("filter-all");
    const filterActiveButton = document.getElementById("filter-active");
    const filterCompletedButton = document.getElementById("filter-completed");
    const taskCounter = document.getElementById("task-counter");
    const completedCounter = document.getElementById("completed-counter");
    const reminderInput = document.getElementById("reminder-input");
    const setReminderButton = document.getElementById("set-reminder");
    const reminderOutput = document.getElementById("reminder-output");
    let tasks = [];
    let filter = "all";
    let reminderTimer = null;
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("tasks");
      tasks = savedTasks ? JSON.parse(savedTasks) : [];
      renderTasks();
    };
    const saveTasks = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
    const renderTasks = () => {
      taskList.innerHTML = "";
      const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
      });
      filteredTasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(index));
        const text = document.createElement("span");
        text.className = task.completed ? "completed" : "";
        text.textContent = task.text;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.className = "delete-task";
        deleteButton.addEventListener("click", () => deleteTask(index));
        listItem.appendChild(checkbox);
        listItem.appendChild(text);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
      });
      updateCounters();
    };
    const addTask = () => {
      const taskText = taskInput.value.trim();
      if (taskText) {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = "";
        saveTasks();
        renderTasks();
      }
    };
    const deleteTask = (index) => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };
    const toggleTask = (index) => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    };
    const clearCompleted = () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    };
    const setFilter = (newFilter) => {
      filter = newFilter;
      renderTasks();
    };
    const updateCounters = () => {
      const remainingTasks = tasks.filter((task) => !task.completed).length;
      const completedTasks = tasks.filter((task) => task.completed).length;
      taskCounter.textContent = `Завдань залишилось: ${remainingTasks}`;
      completedCounter.textContent = `Завдань виконано: ${completedTasks}`;
    };
    const setReminder = () => {
      const reminderText = reminderInput.value.trim();
      if (reminderText) {
        clearTimeout(reminderTimer);
        reminderOutput.textContent = `Нагадування встановлено: ${reminderText}`;
        reminderTimer = setTimeout(() => {
          alert(`Нагадування: ${reminderText}`);
          reminderOutput.textContent = "";
        }, 60000);
        reminderInput.value = "";
      }
    };
    const initEventListeners = () => {
      addTaskButton.addEventListener("click", addTask);
      taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
      });
      clearCompletedButton.addEventListener("click", clearCompleted);
      filterAllButton.addEventListener("click", () => setFilter("all"));
      filterActiveButton.addEventListener("click", () => setFilter("active"));
      filterCompletedButton.addEventListener("click", () => setFilter("completed"));
      setReminderButton.addEventListener("click", setReminder);
    };
    const init = () => {
      loadTasks();
      initEventListeners();
    };
    return { init };
  })();
  document.addEventListener("DOMContentLoaded", app.init);
  