let tasks = {};
let filterTasks = [];
let searchValue = "";
let timeoutId;
let showNewTask;

async function loadTasksFromDatabase() {
  tasks = await getData("tasks");
}

async function renderAllBoards() {
  await loadTasksFromDatabase();
  await renderBoards();
}

async function renderBoards() {
  filterTasks = Object.entries(tasks);
  checkSearchValue();

  await renderTasks("todo-tasks", getTasksByStatus("todo"));
  await renderTasks("progress-tasks", getTasksByStatus("progress"));
  await renderTasks("await-feedback-tasks", getTasksByStatus("await-feedback"));
  await renderTasks("done-tasks", getTasksByStatus("done"));
}

async function renderBoardsByStatus(currentStatus, targetStatus) {
  filterTasks = Object.entries(tasks);
  checkSearchValue();

  await renderTasks(currentStatus + "-tasks", getTasksByStatus(currentStatus));
  await renderTasks(targetStatus + "-tasks", getTasksByStatus(targetStatus));
}

function checkSearchValue() {
  if (searchValue.length >= 1) {
    filterTasks = Object.entries(tasks).filter(
      (task) =>
        task[1].title.toLowerCase().includes(searchValue) ||
        task[1].description.toLowerCase().includes(searchValue)
    );
  }
}

function getTasksByStatus(status) {
  return filterTasks.filter((task) => task[1].status === status);
}

async function renderTasks(boardElementId, boardTasks) {
  let boardElement = document.getElementById(boardElementId);
  let boardTitle = boardElement.getAttribute("title");
  if (boardTasks.length === 0) {
    boardElement.innerHTML = `<div class="no-tasks">No tasks ${boardTitle}</div>`;
  } else {
    boardElement.innerHTML = "";
    for await (const task of boardTasks) {
      let taskId = task[0];
      let taskDetail = task[1];
      boardElement.innerHTML += await taskTemplate(taskId, taskDetail);
      if (taskDetail.users != undefined && taskDetail.users.length > 0) {
        await renderTaskContributors(taskId, taskDetail);
      }
      if (taskDetail.subtasks != undefined && taskDetail.subtasks.length > 0) {
        renderSubtasks(taskId, taskDetail);
      }
    }
  }
}

function renderSubtasks(taskId, taskDetail) {
  let subTasksElement = document.getElementById("subtask-wrapper" + taskId);
  subTasksElement.innerHTML = subTaskTemplate(taskDetail);
}

async function renderTaskContributors(taskId, taskDetail) {
  let taskContributorsElement = document.getElementById(
    "task-contributors" + taskId
  );
  taskContributorsElement.innerHTML = "";
  for await (const userId of taskDetail.users) {
    taskContributorsElement.innerHTML += await taskContributorTemplate(userId);
  }
}

async function taskTemplate(taskId, taskDetail) {
  let categoryDetail = await getData("categories/" + taskDetail.category);
  let priorityDetail = await getData("priorities/" + taskDetail.priority);

  return /*html*/ `<div class="task-view" draggable="true" ondrag="drag(event)" ondragstart="dragstart(event, '${taskId}')" ondragend="dragEnd()" onclick="openTaskDetail('${taskId}')">
                        <div class="userStory" style="background:${categoryDetail.color}">${categoryDetail.title}</div>
                        <div class="task-description">
                            <h2>${taskDetail.title}</h2>
                            <p>${taskDetail.description}</p>
                        </div>
                        <div class="progress-wrapper" id="subtask-wrapper${taskId}"></div>
                        <div class="contributor-listing">
                            <div class="task-contributors" id="task-contributors${taskId}"></div>
                            <div class="icon ${priorityDetail.icon}" style="color:${priorityDetail.color}" title="${priorityDetail.title}"></div>
                        </div>
                    </div>`;
}

function subTaskTemplate(taskDetail) {
  let allSubTasks = taskDetail.subtasks.length;
  let allDoneTasks = taskDetail.subtasks.filter(
    (subtask) => subtask.done === true
  ).length;
  let progressBarPercent = (allDoneTasks * 100) / allSubTasks;

  return /*html*/ `<div class="progress" title="${allDoneTasks} of ${allSubTasks} Subtasks done">
    <div class="progress-bar" style="width: ${progressBarPercent}%;"></div>
    </div>
    <span class="progress-text">${allDoneTasks}/${allSubTasks} Subtasks</span>`;
}

async function taskContributorTemplate(userId) {
  let userDetail = await getData("users/" + userId);
  return /*html*/ `<div class="contributor" style="background-color: ${userDetail.color};">${userDetail.profileImage}</div>`;
}

function search(query) {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(function () {
    searchValue = query.trim().toLowerCase();
    renderBoards();
  }, 500);
}

// Add Task Functionality
function openAddTask(status) {
  eventListenerCloseAddTask();
  document.getElementById("add-task-overlay").style.zIndex = 999;
  document.getElementById("add-task-overlay").style.backgroundColor = "rgb(0 0 0 / 30%)";
  document.getElementById("add-task-container").style.transform = "translateX(0)";
  addTaskstatus = status;
  showNewTask = status;
}

function eventListenerCloseAddTask() {
  const overlay = document.getElementById('add-task-overlay');
  const closeTrigger = function (e) {
    if (e.target !== e.currentTarget) return;
    closeAddTask();
    resetAddTask();
    overlay.removeEventListener('click', closeTrigger);
  };
  overlay.addEventListener('click', closeTrigger);
}

function closeAddTask() {
  document.getElementById('add-task-overlay').style.backgroundColor = 'rgb(0 0 0 / 0%)'
  document.getElementById('add-task-container').style.transform = 'translateX(200%)';
  document.getElementById('add-task-overlay').style.zIndex = -1;
}

// diese Funktion war ursprünglich in onsubmit der AddTask-Form im Board, 
// durch den eventListener in renderAddTaskData() (Zeile 8 in addTask.js) gibt es kein onsubmit mehr.
// Wie sollen die beiden Funktionen renderBoardForNewTask() und closeAddTask() dann ausgeführt werden?
async function renderTaskAfterCreateTask() {
  await renderBoardForNewTask();
  closeAddTask();
}

async function renderBoardForNewTask() {
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);

  await renderTasks(showNewTask + "-tasks", getTasksByStatus(showNewTask));
}