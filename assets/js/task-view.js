let taskId;
let taskInformation;
let taskPriority;
let taskCategory;
let assignedUsers;
let selectedUserIds = [];
let isFirstOpen = true;
let editFormErrors = {
  title: 0,
  dueDate: 0,
};

/**
 * Fetches task-related data from the database, including task information,
 * priority, category, and assigned users. Logs an error message if any of the data retrieval operations fail.
 *
 * @returns {Promise<void>}
 */
async function getDataFromDatabase() {
  try {
    taskInformation = await getData("tasks/" + taskId);
    taskPriority = await getData("priorities/" + taskInformation.priority);
    taskCategory = await getData("categories/" + taskInformation.category);
    assignedUsers = await getDetailAssignedUsers();
  } catch (error) {
    console.error("Get data failed:");
  }
}

/**
 * Retrieves detailed information for the users assigned to the current task.
 * Iterates over the user IDs in the task information, fetches user data from the database,
 * and returns an array of user details. If no users are assigned, returns an empty array.
 *
 * @returns {Promise<Array>} - An array of user details.
 */
async function getDetailAssignedUsers() {
  if (taskInformation.users != undefined && taskInformation.users.length > 0) {
    const userDetails = [];
    for (const userId of taskInformation.users) {
      const user = await getData("users/" + userId);
      user["id"] = userId;
      userDetails.push(user);
    }
    return userDetails;
  }
  return [];
}

/**
 * Opens the task detail view by setting the task ID, fetching the necessary data from the database,
 * loading the templates, and displaying the task detail overlay. Adds a brief delay before showing
 * the task detail and edit task elements for a smoother transition.
 *
 * @param {string} id - The ID of the task to display the details for.
 * @returns {Promise<void>}
 */
async function openTaskDetail(id) {
  taskId = id;
  await getDataFromDatabase();
  await loadTemplates();
  document.getElementById("overlay").classList.remove("d-none");
  document.getElementById("task-detail").classList.remove("d-none");
  setTimeout(() => {
    document.getElementById("task-detail").classList.add("show");
    document.getElementById("edit-task").classList.add("show");
  }, 100);
}

/**
 * Loads the task detail and edit task templates into their respective HTML elements.
 * Replaces the inner HTML of the task detail and edit task containers with the generated templates.
 *
 * @returns {Promise<void>}
 */
async function loadTemplates() {
  document.getElementById("task-detail").innerHTML = taskDetailTemplate();
  document.getElementById("edit-task").innerHTML = editTaskTemplate();
}

/**
 * Closes the task detail overlay and hides the overlay after a delay.
 */
function closeTaskDetail() {
  document.getElementById("task-detail").classList.remove("show");
  document.getElementById("edit-task").classList.remove("show");
  setTimeout(() => {
    document.getElementById("edit-task").classList.add("d-none");
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("edit-task").innerHTML = "";
    document.getElementById("task-detail").innerHTML ="";
  }, 500);
}

/**
 * Displays the delete confirmation section by hiding the edit/delete buttons
 * and showing the delete confirmation prompt in the task detail view.
 */
function showDeleteConfirm() {
  document.getElementById("task-detail-edit-delete").classList.add("d-none");
  document
    .getElementById("task-detail-delete-confirm")
    .classList.remove("d-none");
}

/**
 * Hides the delete confirmation prompt by restoring the edit/delete buttons
 * in the task detail view.
 */
function hideDeleteConfirm() {
  document.getElementById("task-detail-edit-delete").classList.remove("d-none");
  document.getElementById("task-detail-delete-confirm").classList.add("d-none");
}

/**
 * Opens the edit task form by hiding the task detail view and displaying the edit task view.
 * Initializes various form elements including contacts, subtasks, date input, and contact dropdown list.
 * Also sets up the event listeners for the edit task form.
 *
 * @returns {Promise<void>}
 */
async function openEditTaskForm() {
  document.getElementById("task-detail").classList.add("d-none");
  document.getElementById("edit-task").classList.remove("d-none");
  renderContacts("#edit-task-form", taskInformation.users);
  initSubtaskFunctions("#edit-task-form");
  initDateInput("#edit-task-form");
  initContactDropdownList("#edit-task-form");
  editFormEventListener();
}

/**
 * Adds an event listener to the edit task form, handling form submission and
 * validating required fields. If there are no validation errors, it triggers
 * the edit confirmation process.
 */
function editFormEventListener() {
  let formElement = document.getElementById("edit-task-form");
  formElement.addEventListener("submit", handleEditFormSubmit);
}

/**
 * Handles the submit event for the edit task form.
 * Prevents the default form submission behavior, validates the title and due date fields,
 * and proceeds to confirm the edit if the fields are valid (no errors).
 *
 * @param {Event} e - The submit event object.
 * @returns {Promise<void>}
 */
async function handleEditFormSubmit(e) {
  e.preventDefault();
  checkEditFormValidation("title", "The title field is required");
  checkEditFormValidation("due-date", "The Date field is required");
  if (editFormErrors.title === 0 && editFormErrors.dueDate === 0) {
    await confirmEdit();
  }
}

/**
 * Checks the validity of an input field within the edit task form. Displays an error message
 * if the input is invalid or matches a placeholder value, and updates the validation status
 * in `editFormErrors`.
 *
 * @param {string} inputName - The name attribute of the input element to validate.
 * @param {string} message - The error message to display if validation fails.
 */
function checkEditFormValidation(inputName, message) {
  let inputElement = document.querySelector(
    `#edit-task-form *[name = ${inputName}]`
  );
  if (!inputElement.checkValidity()) {
    showInputValidationError("#edit-task-form", inputName, message);
    editFormErrors[inputName] = 1;
  } else {
    hideInputValidationError("#edit-task-form", inputName);
    editFormErrors[inputName] = 0;
  }
  if (inputElement.value === "dd/mm/yyyy") {
    showInputValidationError("#edit-task-form", inputName, message);
    editFormErrors[inputName] = 1;
  }
}

/**
 * Confirms the edit of a task by updating the task data, re-fetching the task details,
 * reloading the templates, and refreshing the task list. Hides the edit task view
 * and shows the updated task detail view.
 *
 * @returns {Promise<void>}
 */
async function confirmEdit() {
  await updateTaskData();
  await getDataFromDatabase();
  await loadTemplates();
  hideEditTaskShowDetailView();
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);
  await renderTasks(
    taskInformation.status + "-tasks",
    getTasksByStatus(taskInformation.status)
  );
}

/**
 * Hides the edit task view and shows the task detail view.
 * Updates the CSS classes of the relevant HTML elements to manage their visibility.
 */
function hideEditTaskShowDetailView() {
  document.getElementById("task-detail").classList.remove("d-none");
  document.getElementById("task-detail").classList.add("show");
  document.getElementById("edit-task").classList.add("d-none");
  document.getElementById("edit-task").classList.add("show");
}

/**
 * Confirms the deletion of a task by removing task data from the database,
 * hiding the task detail and edit views, and updating the task list.
 *
 * @async
 */
async function confirmDelete() {
  await deleteTaskData();
  document.getElementById("task-detail").classList.remove("show");
  document.getElementById("edit-task").classList.remove("show");
  document.getElementById("overlay").classList.add("d-none");
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);
  await renderTasks(
    taskInformation.status + "-tasks",
    getTasksByStatus(taskInformation.status)
  );
}

/**
 * Updates the task data in the database with the latest form input values, including title,
 * description, assigned users, due date, priority, category, subtasks, and status.
 * Collects form data, constructs an updated task object, and saves it to the database.
 *
 * @async
 * @throws {Error} Logs an error to the console if updating the task fails.
 */
async function updateTaskData() {
  try {
    const {
      title,
      description,
      users,
      date,
      priority,
      category,
      subtasks,
      status,
    } = gatherTaskFormData();
    const data = createTaskDataObject(
      title,
      description,
      users,
      date,
      priority,
      category,
      subtasks,
      status
    );
    await putData("tasks", taskId, data);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
  }
}

/**
 * Gathers task data from the edit task form, including title, description, assigned users,
 * due date, priority, category, subtasks, and status.
 *
 * @returns {Object} - An object containing the gathered task data.
 */
function gatherTaskFormData() {
  let title = document.querySelector("#edit-task-form *[name=title]").value;
  let description =
    document.querySelector("#edit-task-form *[name=description]").value || "";
  let assignedSpans = document
    .querySelector("#edit-task-form .assigned-to")
    .querySelectorAll("span");
  let users = Array.from(assignedSpans).map((span) => span.id);
  let date = document.querySelector("#edit-task-form *[name=due-date]").value;
  let priority = document.querySelector("#edit-task-form *[name=prio]").value;
  let category = taskInformation.category;
  let subtasks = Array.from(
    document.querySelector("#edit-task-form .subtask-list").children
  ).map((li) => ({
    done: li.querySelector(".subtask-title").getAttribute("status") == "true",
    title: li.querySelector(".subtask-title").textContent,
  }));
  let status = taskInformation.status;
  return {
    title,
    description,
    users,
    date,
    priority,
    category,
    subtasks,
    status,
  };
}

/**
 * Creates a task data object with the provided task details.
 * Ensures that the users and subtasks arrays are not empty.
 *
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {Array<string>} users - An array of user IDs assigned to the task.
 * @param {string} date - The due date of the task.
 * @param {string} priority - The priority level of the task.
 * @param {string} category - The category of the task.
 * @param {Array<Object>} subtasks - An array of subtask objects.
 * @param {string} status - The status of the task.
 * @returns {Object} - An object containing the task data.
 */
function createTaskDataObject(
  title,
  description,
  users,
  date,
  priority,
  category,
  subtasks,
  status
) {
  return {
    title: title,
    description: description,
    users: users.length > 0 ? users : [],
    date: date,
    priority: priority,
    category: category,
    subtasks: subtasks.length > 0 ? subtasks : [],
    status: status,
  };
}

/**
 * Deletes the task data from the database based on the `taskId`.
 *
 * @async
 */
async function deleteTaskData() {
  await deleteData("tasks", taskId);
}
