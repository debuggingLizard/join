let tasks = {};
let filterTasks = [];
let searchValue = "";
let timeoutId;
let showNewTask;

/**
 * Loads tasks from the database and triggers board rendering.
 */
async function loadTasksFromDatabase() {
  tasks = await getData("tasks");
  renderBoards();
}

/**
 * Filters tasks and renders them by status in their respective board sections.
 */
async function renderBoards() {
  filterTasks = Object.entries(tasks);
  checkSearchValue();
  await renderTasks("todo-tasks", getTasksByStatus("todo"));
  await renderTasks("progress-tasks", getTasksByStatus("progress"));
  await renderTasks("await-feedback-tasks", getTasksByStatus("await-feedback"));
  await renderTasks("done-tasks", getTasksByStatus("done"));
}

/**
 * Filters tasks and renders them by the specified current and target statuses.
 * @param {string} currentStatus - The current status of tasks to render.
 * @param {string} targetStatus - The target status of tasks to render.
 */
async function renderBoardsByStatus(currentStatus, targetStatus) {
  filterTasks = Object.entries(tasks);
  checkSearchValue();
  await renderTasks(currentStatus + "-tasks", getTasksByStatus(currentStatus));
  await renderTasks(targetStatus + "-tasks", getTasksByStatus(targetStatus));
}

/**
 * Filters tasks based on a search value in the title or description if the search value is non-empty.
 */
function checkSearchValue() {
  if (searchValue.length >= 1) {
    filterTasks = Object.entries(tasks).filter(
      (task) =>
        task[1].title.toLowerCase().includes(searchValue) ||
        task[1].description.toLowerCase().includes(searchValue)
    );
  }
}

/**
 * Returns tasks that match the specified status from the filtered tasks.
 * @param {string} status - The status to filter tasks by.
 * @returns {Array} Tasks with the given status.
 */
function getTasksByStatus(status) {
  return filterTasks.filter((task) => task[1].status === status);
}

/**
 * Renders tasks in the specified board element; shows a placeholder if no tasks are present.
 * @param {string} boardElementId - The ID of the board to render tasks in.
 * @param {Array} boardTasks - The list of tasks to display in the board.
 */
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

/**
 * Renders subtasks for a specific task in the designated subtask wrapper element.
 * @param {string} taskId - The ID of the task to render subtasks for.
 * @param {object} taskDetail - The task details, including subtasks.
 */
function renderSubtasks(taskId, taskDetail) {
  let subTasksElement = document.getElementById("subtask-wrapper" + taskId);
  subTasksElement.innerHTML = subTaskTemplate(taskDetail);
}

/**
 * Renders contributors for a specific task in the task contributors element.
 * @param {string} taskId - The ID of the task to render contributors for.
 * @param {object} taskDetail - The task details, including assigned users.
 */
async function renderTaskContributors(taskId, taskDetail) {
  let taskContributorsElement = document.getElementById(
    "task-contributors" + taskId
  );
  taskContributorsElement.innerHTML = "";
  for await (const userId of taskDetail.users) {
    taskContributorsElement.innerHTML += await taskContributorTemplate(userId);
  }
}

/**
 * Creates an HTML template for a task card with category, description, subtasks, contributors, and priority.
 */
async function taskTemplate(taskId, taskDetail) {
  let categoryDetail = await getData("categories/" + taskDetail.category);
  let priorityDetail = await getData("priorities/" + taskDetail.priority);

  return /*html*/ `<div class="task-view" draggable="true" ondrag="drag(event)" ondragstart="dragstart(event, '${taskId}')" ondragend="dragEnd()" onclick="openTaskDetail()">
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

/**
 * Generates an HTML template for a subtask progress bar, showing completed and total subtasks.
 */
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

/**
 * Returns HTML for a task contributor.
 */
async function taskContributorTemplate(userId) {
  let userDetail = await getData("users/" + userId);
  return /*html*/ `<div class="contributor" style="background-color: ${userDetail.color};">${userDetail.profileImage}</div>`;
}

/**
 * Debounces and updates search query, then renders boards.
 */
function search(query) {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(function () {
    searchValue = query.trim().toLowerCase();
    renderBoards();
  }, 500);
}

/**
 * Opens the add task overlay and sets task status.
 */
function openAddTask(status) {
  eventListenerCloseAddTask();
  document.getElementById("add-task-overlay").style.zIndex = 999;
  document.getElementById("add-task-overlay").style.backgroundColor =
    "rgb(0 0 0 / 30%)";
  document.getElementById("add-task-container").style.transform =
    "translateX(0)";
  addTaskstatus = status;
  showNewTask = status;
}

/**
 * Adds a click event to close and reset the add task overlay.
 */
function eventListenerCloseAddTask() {
  const overlay = document.getElementById("add-task-overlay");
  const closeTrigger = function (e) {
    if (e.target !== e.currentTarget) return;
    closeAddTask();
    resetAddTask();
    overlay.removeEventListener("click", closeTrigger);
  };
  overlay.addEventListener("click", closeTrigger);
}

/**
 * Closes the add task overlay by resetting styles.
 */
function closeAddTask() {
  document.getElementById("add-task-overlay").style.backgroundColor =
    "rgb(0 0 0 / 0%)";
  document.getElementById("add-task-container").style.transform =
    "translateX(200%)";
  document.getElementById("add-task-overlay").style.zIndex = -1;
}

/**
 * Renders board with the new task and closes the add task overlay.
 */
async function renderTaskAfterCreateTask() {
  await renderBoardForNewTask();
  closeAddTask();
}

/**
 * Fetches tasks, filters, and renders the board for the new task.
 */
async function renderBoardForNewTask() {
  tasks = await getData("tasks");
  filterTasks = Object.entries(tasks);

  await renderTasks(showNewTask + "-tasks", getTasksByStatus(showNewTask));
}
