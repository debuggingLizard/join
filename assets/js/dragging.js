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
 * Adds drag event listeners to all elements with the class "drop-target".
 * Iterates through each drop target and attaches the event listeners using the `addDragQueenEventListeners` function.
 */
function loadDropTargets() {
  const dropTargets = document.querySelectorAll(".drop-target");
  dropTargets.forEach(addDragQueenEventListeners);
}

/**
 * Adds drag event listeners to the specified target element.
 * The event listeners handle the dragover, dragenter, and dragleave events.
 *
 * @param {Element} target - The target element to which the drag event listeners will be added.
 */
function addDragQueenEventListeners(target) {
  target.addEventListener("dragover", handleDragOver);
  target.addEventListener("dragenter", handleDragEnter);
  target.addEventListener("dragleave", handleDragLeave);
}

/**
 * Handles the dragover event on a target element.
 * Prevents the default behavior, and if an element hasn't been added yet,
 * creates a new div element with specific dimensions and appends it to the current target element.
 *
 * @param {DragEvent} e - The dragover event object.
 */
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

/**
 * Handles the dragenter event on a target element.
 * Sets the `isOverDropTarget` variable to true, indicating that a draggable element is over a drop target.
 */
function handleDragEnter() {
  isOverDropTarget = true;
}

/**
 * Handles the dragleave event on a target element.
 * Checks if a draggable element is over a drop target and if the related target is not contained within the current target.
 * If an element was added, it removes the added element from the current target and resets the variables.
 *
 * @param {DragEvent} e - The dragleave event object.
 */
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
