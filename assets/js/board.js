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
}

/**
 * Loads tasks from the database and renders all boards.
 */
async function renderAllBoards() {
  await loadTasksFromDatabase();
  await renderBoards();
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
    await renderTasksThatExist(boardElement, boardTasks);
  }
}

/**
 * Renders existing tasks in the specified board element.
 * Clears the current content of the board element, then iterates over the tasks,
 * generating and appending the task templates. If a task has users or subtasks,
 * it renders the contributors and subtasks accordingly.
 *
 * @param {Element} boardElement - The DOM element where the tasks will be rendered.
 * @param {Array} boardTasks - An array of tasks, where each task is represented by a [taskId, taskDetail] pair.
 * @returns {Promise<void>}
 */
async function renderTasksThatExist(boardElement, boardTasks) {
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
 * Fetches task data and returns the HTML template.
 * @param {string} taskId - Task ID.
 * @param {object} taskDetail - Task details.
 * @returns {Promise<string>} - Task HTML as a string.
 */
async function taskTemplate(taskId, taskDetail) {
  let categoryDetail = await getData("categories/" + taskDetail.category);
  let priorityDetail = await getData("priorities/" + taskDetail.priority);

  return createTaskHtml(taskId, taskDetail, categoryDetail, priorityDetail);
}

/**
 * Creates HTML for task view.
 * @param {string} taskId - Task ID.
 * @param {object} taskDetail - Task details.
 * @param {object} categoryDetail - Category info (color, title).
 * @param {object} priorityDetail - Priority info (icon, color, title).
 * @returns {string} - HTML template.
 */
function createTaskHtml(taskId, taskDetail, categoryDetail, priorityDetail) {
  return /*html*/ `<div class="task-view" draggable="true" ondrag="drag(event)" ondragstart="dragstart(event, '${taskId}')" ondragend="dragEnd()" onclick="openTaskDetail('${taskId}')">
                    <div class="task-view-top">
                      <div class="category-move-task-container">
                        <div class="userStory" style="background:${categoryDetail.color}">${categoryDetail.title}</div>
                        <div class="move-task-menu" title="Move Task to...">
                        <svg onclick="openMoveTaskDropdown(event, '${taskId}')" enable-background="new 0 0 16 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> 
                          <path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_" fill="#a8a8a8"/> 
                          <path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_" fill="#a8a8a8"/> 
                          <path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_" fill="#a8a8a8"/> 
                        </svg>
                        <div id="move-task-dropdown-${taskId}" class="move-task-dropdown d-none" onclick="event.stopPropagation()">
                          <p class="move-task-text">Move task to...</p>
                          <p id="move-task-todo-${taskId}" onclick="changeStatus('todo', '${taskId}')">To do</p>
                          <p id="move-task-progress-${taskId}" onclick="changeStatus('progress', '${taskId}')">In progress</p>
                          <p id="move-task-await-feedback-${taskId}" onclick="changeStatus('await-feedback', '${taskId}')">Await Feedback</p>
                          <p id="move-task-done-${taskId}" onclick="changeStatus('done', '${taskId}')">Done</p>
                        </div>
                        </div>
                      </div>
                      <div class="task-description">
                        <h2>${taskDetail.title}</h2>
                        <p>${taskDetail.description}</p>
                      </div>
                    </div>
                    <div class="task-view-bottom">
                      <div class="progress-wrapper" id="subtask-wrapper${taskId}"></div>
                      <div class="contributor-listing">
                        <div class="task-contributors" id="task-contributors${taskId}"></div>
                        <div class="icon ${priorityDetail.icon}" style="color:${priorityDetail.color}" title="${priorityDetail.title}"></div>
                      </div>
                    </div>
                  </div>`;
}

/**
 * Generates the HTML template for displaying the progress of subtasks within a task.
 * Calculates the number of completed subtasks, the total number of subtasks, and
 * the percentage progress. Creates a progress bar and a text indicator.
 *
 * @param {Object} taskDetail - The task detail object containing an array of subtasks.
 * @returns {string} - The HTML string for the subtask progress display.
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
 * Generates the HTML template for a task contributor.
 * Fetches the user details based on the provided userId and creates a styled div element
 * with the user's profile image and background color.
 *
 * @param {string} userId - The ID of the user to fetch details for.
 * @returns {Promise<string>} - The HTML string for the task contributor.
 */
async function taskContributorTemplate(userId) {
  let userDetail = await getData("users/" + userId);
  return /*html*/ `<div class="contributor" style="background-color: ${userDetail.color};">${userDetail.profileImage}</div>`;
}

/**
 * Initiates a search with a debouncing mechanism to avoid excessive function calls.
 * Clears any existing timeout, sets a new timeout to update the search value after 500ms,
 * and triggers the rendering of the boards.
 *
 * @param {string} query - The search query entered by the user.
 */
function search(query) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    searchValue = query.trim().toLowerCase();
    renderBoards();
  }, 500);
}

/**
 * Opens the add task overlay and sets its visual properties.
 * Initializes the task status and prepares the overlay for adding a new task.
 *
 * @param {string} status - The status of the task to be added.
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
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);

  await renderTasks(showNewTask + "-tasks", getTasksByStatus(showNewTask));
}
