/**
 * Opens the move task dropdown menu for a specific task by toggling its visibility.
 * Prevents the click event from propagating to parent elements.
 * Hides the current status move task element and shows the dropdown for moving the task.
 *
 * @param {Event} event - The click event object.
 * @param {string} taskId - The ID of the task to move.
 */
function openMoveTaskDropdown(event, taskId) {
  event.stopPropagation();
  let currentStatus = tasks[taskId].status;
  document
    .getElementById("move-task-" + currentStatus + "-" + taskId)
    .classList.add("d-none");
  document
    .getElementById("move-task-dropdown-" + taskId)
    .classList.toggle("d-none");
}

/**
 * Changes the status of a task if the new status is different from the current status.
 * Updates the task status, re-renders the boards, and saves the new status to the server.
 *
 * @param {string} newStatus - The new status to set for the task.
 * @param {string} taskId - The ID of the task to update.
 */
async function changeStatus(newStatus, taskId) {
  if (tasks[taskId].status !== newStatus) {
    let currentStatus = tasks[taskId].status;
    tasks[taskId].status = newStatus;
    renderBoardsByStatus(currentStatus, newStatus);
    await putData("tasks", taskId + "/status", newStatus);
  }
}
