/**
 * Opens the task detail overlay and displays the task details.
 */
function openTaskDetail() {
  const overlay = document.getElementById("overlay");
  const taskDetail = document.getElementById("task-detail");
  overlay.style.display = "flex";
  setTimeout(() => {
    taskDetail.classList.add("show");
  }, 10);
}

/**
 * Closes the task detail overlay and hides the overlay after a delay.
 */
function closeTaskDetail() {
  const taskDetail = document.getElementById("task-detail");
  taskDetail.classList.remove("show");
  setTimeout(() => {
    document.getElementById("overlay").style.display = "none";
  }, 300);
}
