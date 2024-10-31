let currentDraggable = null;
let currentDraggingElementId;
let offsetX = 0;
let offsetY = 0;
let width = 0;
let height = 0;
let elementAdded = false;
let addedElement = null;
let isOverDropTarget = false;

/**
 * Initializes drag for a task, setting size, offset, and custom drag image.
 * @param {Event} e - The drag event.
 * @param {string} taskId - The ID of the task being dragged.
 */
function dragstart(e, taskId) {
  currentDraggingElementId = taskId;
  e.dataTransfer.setData("text/plain", null);
  currentDraggable = e.target;
  width = currentDraggable.offsetWidth;
  height = currentDraggable.offsetHeight;
  currentDraggable.style.width = `${width}px`;
  currentDraggable.style.height = `${height}px`;
  offsetX = e.clientX - currentDraggable.getBoundingClientRect().left;
  offsetY = e.clientY - currentDraggable.getBoundingClientRect().top;
  e.dataTransfer.setDragImage(new Image(), 0, 0);
}

/**
 * Moves the dragged element, adjusting for scroll and pointer events.
 * @param {Event} e - The drag event.
 */
function drag(e) {
  currentDraggable.classList.add("dragging");
  currentDraggable.style.top = `${e.clientY + window.scrollY - offsetY}px`; // Adjust for scrolling
  currentDraggable.style.left = `${e.clientX + window.scrollX - offsetX}px`; // Adjust for scrolling
  currentDraggable.style.pointerEvents = "none";
}

/**
 * Ends drag by resetting element styles and clearing current draggable reference.
 */
function dragEnd() {
  currentDraggable.classList.remove("dragging");
  currentDraggable.style.width = "";
  currentDraggable.style.height = "";
  currentDraggable.style.left = "";
  currentDraggable.style.top = "";
  currentDraggable = null;
  elementAdded = false;
}

/**
 * Updates task status on drop, re-renders boards, and saves status.
 * @param {Event} e - The drop event.
 * @param {string} targetStatus - The target status for the dropped task.
 */
async function drop(e, targetStatus) {
  e.preventDefault();
  let currentStatus = tasks[currentDraggingElementId].status;
  tasks[currentDraggingElementId].status = targetStatus;
  renderBoardsByStatus(currentStatus, targetStatus);
  await putData("tasks", currentDraggingElementId + "/status", targetStatus);
}

/**
 * Sets up drop targets to show a placeholder during drag-over and remove it on leave.
 */
function loadDropTargets() {
  const dropTargets = document.querySelectorAll(".drop-target");
  dropTargets.forEach(addDragQueenEventListeners);
}

function addDragQueenEventListeners(target) {
  target.addEventListener("dragover", handleDragOver);
  target.addEventListener("dragenter", handleDragEnter);
  target.addEventListener("dragleave", handleDragLeave);
}

function handleDragOver(e) {
  e.preventDefault();
  if (!elementAdded) {
    const newElement = document.createElement("div");
    newElement.classList.add("dragging-target-area");
    newElement.style.width = `${width}px`;
    newElement.style.height = `${height}px`;
    e.currentTarget.appendChild(newElement);
    elementAdded = true;
    addedElement = newElement;
  }
}

function handleDragEnter() {
  isOverDropTarget = true;
}

function handleDragLeave(e) {
  if (isOverDropTarget && !e.currentTarget.contains(e.relatedTarget)) {
    if (addedElement) {
      e.currentTarget.removeChild(addedElement);
      elementAdded = false;
      addedElement = null;
    }
    isOverDropTarget = false;
  }
}
