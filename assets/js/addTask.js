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

/**
 * Updates button visibility and content based on subtask input:
 * shows clear button and changes add button to ✓ when typing,
 * resets to + when cleared or subtask is added.
 */
document.addEventListener("DOMContentLoaded", function () {
  const subtaskInput = document.getElementById("subtasks");
  const clearBtn = document.querySelector(".clear-subtask-btn");
  const divider = document.querySelector(".button-divider");
  const addBtn = document.querySelector(".add-subtask-btn");
  if (subtaskInput) {
    subtaskInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addSubtask();
      }
    });
    subtaskInput.addEventListener("input", function () {
      if (subtaskInput.value.length > 0) {
        clearBtn.style.display = "block";
        divider.style.display = "block";
        addBtn.innerHTML =
          '<img src="./assets/buttons/check.svg" alt="Checkmark" style="width: 20px; height: 20px;">';
      } else {
        clearBtn.style.display = "none";
        divider.style.display = "none";
        addBtn.innerHTML = "+";
      }
    });
    clearBtn.addEventListener("click", function () {
      subtaskInput.value = "";
      clearBtn.style.display = "none";
      divider.style.display = "none";
      addBtn.innerHTML = "+";
    });
  }
});

/**
 * Adds a new subtask, clears the input field, resets the add button to '+', and hides the clear button and divider.
 */
function addSubtask() {
  const subtaskInput = document.getElementById("subtasks");
  const subtaskValue = subtaskInput.value.trim();
  const addBtn = document.querySelector(".add-subtask-btn");
  const clearBtn = document.querySelector(".clear-subtask-btn");
  const divider = document.querySelector(".button-divider");
  if (subtaskValue) {
    const subtaskList = document.getElementById("subtask-list");
    const listItem = document.createElement("li");
    listItem.classList.add("subtask-item");
    listItem.innerHTML = `
      <span class="subtask-title">${subtaskValue}</span>
      <div class="subtask-actions">
        <button type="button" class="edit-subtask-btn" onclick="editSubtask(this)"><img src="./assets/buttons/edit.svg" alt="Edit" style="width: 16px; height: 16px;"></button>
        <button type="button" class="delete-subtask-btn" onclick="deleteSubtask(this)"><img src="./assets/buttons/delete.svg" alt="Delete" style="width: 16px; height: 16px;"></button>
      </div>
    `;
    subtaskList.appendChild(listItem);
    subtaskInput.value = "";
    addBtn.innerHTML = "+";
    clearBtn.style.display = "none";
    divider.style.display = "none";
  }
}

/**
 * Edits the text of an existing subtask.
 * @param {HTMLElement} button - The button clicked to edit the subtask.
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
 * Deletes an existing subtask.
 * @param {HTMLElement} button - The button clicked to delete the subtask.
 */
function deleteSubtask(button) {
  const listItem = button.parentElement.parentElement;
  listItem.remove();
}

/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
  const subtaskInput = document.getElementById("subtasks");
  subtaskInput.value = "";
}
