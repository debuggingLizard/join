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
  let subtaskInput = document.getElementById("subtasks");
  let clearBtn = document.querySelector(".clear-subtask-btn");
  let divider = document.querySelector(".button-divider");
  let addBtn = document.querySelector(".add-subtask-btn");
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
  let subtaskInput = document.getElementById("subtasks");
  let subtaskValue = subtaskInput.value.trim();
  let addBtn = document.querySelector(".add-subtask-btn");
  let clearBtn = document.querySelector(".clear-subtask-btn");
  let divider = document.querySelector(".button-divider");
  if (subtaskValue) {
    let subtaskList = document.getElementById("subtask-list");
    let listItem = document.createElement("li");
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
  let listItem = button.parentElement.parentElement;
  let subtaskTitle = listItem.querySelector(".subtask-title");
  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = subtaskTitle.textContent;
  inputField.classList.add("edit-input");
  listItem.replaceChild(inputField, subtaskTitle);
  inputField.addEventListener("blur", function () {
    saveSubtaskEdit(listItem, inputField);
  });
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveSubtaskEdit(listItem, inputField);
    }
  });
  inputField.focus();
}

function saveSubtaskEdit(listItem, inputField) {
  let newTitle = inputField.value.trim();
  if (newTitle !== "") {
    let newSubtaskTitle = document.createElement("span");
    newSubtaskTitle.classList.add("subtask-title");
    newSubtaskTitle.textContent = newTitle;
    listItem.replaceChild(newSubtaskTitle, inputField);
  }
}

/**
 * Deletes an existing subtask.
 * @param {HTMLElement} button - The button clicked to delete the subtask.
 */
function deleteSubtask(button) {
  let listItem = button.parentElement.parentElement;
  listItem.remove();
}

/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtasks");
  subtaskInput.value = "";
}
