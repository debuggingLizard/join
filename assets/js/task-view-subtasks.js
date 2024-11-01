/**
 * Toggles the completion status of a subtask, updating its visual state and storing the
 * change in the database. Refreshes the task list and the edit task template after updating.
 *
 * @async
 * @param {number} index - The index of the subtask in `taskInformation.subtasks` to toggle.
 */
async function toggleSubtask(index) {
  let subTaskStatus;
  const subtaskElement = document.getElementById(`subtask-${index}`);
  const unchecked = document.getElementById(`unchecked-${index}`);
  const checked = document.getElementById(`checked-${index}`);
  subtaskElement.style.pointerEvents = "none";
  if (taskInformation.subtasks[index].done) {
    subTaskStatus = markSubtaskAsNotDone(index, unchecked, checked);
  } else {
    subTaskStatus = markSubstaskAsDone(index, unchecked, checked);
  }
  await updateTaskDataForSubtaskStatusChange(index, subTaskStatus);
  document.getElementById("edit-task").innerHTML = editTaskTemplate();
  subtaskElement.style.pointerEvents = "auto";
}

/**
 * Marks a subtask as not done by updating its status and adjusting the visibility of the corresponding UI elements.
 *
 * @param {number} index - The index of the subtask in the taskInformation object.
 * @param {boolean} subTaskStatus - The status of the subtask, set to false.
 * @param {Element} unchecked - The HTML element representing the unchecked state of the subtask.
 * @param {Element} checked - The HTML element representing the checked state of the subtask.
 */
function markSubtaskAsNotDone(index, unchecked, checked) {
  taskInformation.subtasks[index].done = false;
  unchecked.classList.remove("d-none");
  checked.classList.add("d-none");
  return false;
}

/**
 * Marks a subtask as done by updating its status and adjusting the visibility of the corresponding UI elements.
 *
 * @param {number} index - The index of the subtask in the taskInformation object.
 * @param {boolean} subTaskStatus - The status of the subtask, set to true.
 * @param {Element} unchecked - The HTML element representing the unchecked state of the subtask.
 * @param {Element} checked - The HTML element representing the checked state of the subtask.
 */
function markSubstaskAsDone(index, unchecked, checked) {
  taskInformation.subtasks[index].done = true;
  unchecked.classList.add("d-none");
  checked.classList.remove("d-none");
  return true;
}

/**
 * Updates the task data in the database to reflect the status change of a subtask.
 * Posts the updated subtask status, reloads the tasks from the database,
 * updates the task list, and re-renders the tasks by their status.
 *
 * @param {number} index - The index of the subtask in the task information.
 * @param {boolean} subTaskStatus - The updated status of the subtask.
 * @returns {Promise<void>}
 */
async function updateTaskDataForSubtaskStatusChange(index, subTaskStatus) {
  await putData(
    "tasks",
    taskId + "/subtasks/" + index + "/done",
    subTaskStatus
  );
  await loadTasksFromDatabase();
  filterTasks = Object.entries(tasks);
  await renderTasks(
    taskInformation.status + "-tasks",
    getTasksByStatus(taskInformation.status)
  );
}
