/**
 * Sets the selected priority button as active and removes the active class from others.
 *
 * @param {string} selected - The class name of the selected priority button.
 */
function selectPrio(selected) {
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.${selected}`).classList.add("active");
  // document.getElementById("selectedPrio").value = selected;
}

document.addEventListener("DOMContentLoaded", function () {
  // Event-Listener für das Drücken der Eingabetaste im Subtask-Eingabefeld
  const subtaskInput = document.getElementById("subtasks");

  if (subtaskInput) {
    subtaskInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addSubtask();
      }
    });
  }
});

/**
 * Fügt einen neuen Subtask zur Liste der Subtasks hinzu.
 */
function addSubtask() {
  const subtaskInput = document.getElementById("subtasks");
  const subtaskValue = subtaskInput.value.trim();

  if (subtaskValue) {
    const subtaskList = document.getElementById("subtask-list");

    // Erstelle ein neues Listenelement für den Subtask
    const listItem = document.createElement("li");
    listItem.classList.add("subtask-item");
    listItem.innerHTML = `
      <span class="subtask-title">${subtaskValue}</span>
      <div class="subtask-actions">
        <button type="button" class="edit-subtask-btn" onclick="editSubtask(this)">✏️</button>
        <button type="button" class="delete-subtask-btn" onclick="deleteSubtask(this)">🗑️</button>
      </div>
    `;
    subtaskList.appendChild(listItem);

    // Leere das Eingabefeld
    subtaskInput.value = "";
  }
}

/**
 * Bearbeitet einen bestehenden Subtask.
 * @param {HTMLElement} button - Der Button, der geklickt wurde, um den Subtask zu bearbeiten.
 */
function editSubtask(button) {
  const listItem = button.parentElement.parentElement;
  const subtaskTitle = listItem.querySelector(".subtask-title");
  const newTitle = prompt("Edit subtask:", subtaskTitle.textContent);

  if (newTitle !== null) {
    subtaskTitle.textContent = newTitle.trim();
  }
}

/**
 * Löscht einen bestehenden Subtask.
 * @param {HTMLElement} button - Der Button, der geklickt wurde, um den Subtask zu löschen.
 */
function deleteSubtask(button) {
  const listItem = button.parentElement.parentElement;
  listItem.remove();
}
