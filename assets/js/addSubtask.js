/**
 * Initializes subtask functionalities such as input handling, button visibility, and subtask editing.
 * @param {string} formId - The ID of the form element where subtasks are managed.
 */
function initSubtaskFunctions(formId) {
  const subtaskInput = document.querySelector(`${formId} *[name=subtasks]`);
  const clearSubtaskBtn = document.querySelector(
    `${formId} .clear-subtask-btn`
  );
  const addBtn = document.querySelector(`${formId} .add-subtask-btn`);
  const subtaskList = document.querySelector(`${formId} .subtask-list`);
  if (subtaskInput) {
    handleSubtaskInput(formId, subtaskInput, addBtn, clearSubtaskBtn);
    setupClearButton(clearSubtaskBtn, subtaskInput, addBtn);
    enableSubtaskEditing(subtaskList);
  }
}

/**
 * Handles 'Enter' key event for adding subtasks and input event to manage button visibility.
 * @param {HTMLElement} input - The subtask input element.
 * @param {HTMLElement} addBtn - The add button for subtasks.
 * @param {HTMLElement} clearBtn - The clear button for the subtask input.
 */
function handleSubtaskInput(formId, input, addBtn, clearBtn) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask(formId);
    }
  });
  input.addEventListener("input", () =>
    toggleButtonVisibility(input, addBtn, clearBtn)
  );
}

/**
 * Toggles the visibility and icon of add and clear buttons based on the input value.
 * @param {HTMLElement} input - The subtask input element.
 * @param {HTMLElement} addBtn - The add button for subtasks.
 * @param {HTMLElement} clearBtn - The clear button for the subtask input.
 */
function toggleButtonVisibility(input, addBtn, clearBtn) {
  const hasValue = input.value.length > 0;
  clearBtn.style.display = hasValue ? "flex" : "none";
  addBtn.classList.toggle("icon-check", hasValue);
  addBtn.classList.toggle("icon-add", !hasValue);
}

/**
 * Sets up the clear button to reset the input field and buttons to default state.
 * @param {HTMLElement} clearBtn - The clear button for the subtask input.
 * @param {HTMLElement} input - The subtask input element.
 * @param {HTMLElement} addBtn - The add button for subtasks.
 */
function setupClearButton(clearBtn, input, addBtn) {
  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    addBtn.classList.add("icon-add");
    addBtn.classList.remove("icon-check");
  });
}

/**
 * Enables subtask editing when a subtask title is double-clicked.
 * @param {HTMLElement} subtaskList - The container element for subtasks.
 */
function enableSubtaskEditing(subtaskList) {
  subtaskList.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("subtask-title")) {
      const editButton =
        e.target.parentElement.querySelector(".edit-subtask-btn");
      editSubtask(editButton);
    }
  });
}

/**
 * Initializes the subtask addition by retrieving the input value and calling subsequent actions.
 *
 * @param {string} formId - The ID of the form containing the subtask.
 */
function addSubtask(formId) {
  let subtaskInput = getSubtaskInput(formId);
  let subtaskValue = subtaskInput.value.trim();
  if (subtaskValue) {
    appendSubtaskToList(formId, subtaskValue);
    resetSubtaskInput(formId);
  }
}

/**
 * Retrieves the subtask input element from the form.
 *
 * @param {string} formId - The ID of the form.
 * @returns {HTMLElement} - The subtask input element.
 */
function getSubtaskInput(formId) {
  return document.querySelector(`${formId} *[name = subtasks]`);
}

/**
 * Creates a new subtask list item and appends it to the subtask list.
 *
 * @param {string} formId - The ID of the form containing the subtask list.
 * @param {string} subtaskValue - The text content of the subtask.
 */
function appendSubtaskToList(formId, subtaskValue) {
  let subtaskList = document.querySelector(`${formId} .subtask-list`);
  let listItem = createSubtaskListItem(subtaskValue);
  subtaskList.appendChild(listItem);
}

/**
 * Creates a new list item element for the subtask with necessary actions.
 *
 * @param {string} subtaskValue - The text content of the subtask.
 * @returns {HTMLElement} - The created list item element.
 */
function createSubtaskListItem(subtaskValue) {
  let listItem = document.createElement("li");
  listItem.classList.add("subtask-item");
  listItem.innerHTML = getSubtaskListItemTemplate(subtaskValue);
  return listItem;
}

/**
 * Generates the HTML template for a subtask list item.
 * The template includes the subtask dot, title, and action buttons for editing and deleting.
 *
 * @param {string} subtaskValue - The value or title of the subtask.
 * @returns {string} - The HTML string for the subtask list item.
 */
function getSubtaskListItemTemplate(subtaskValue) {
  return `
        <span class="subtask-dot"></span>
      <span ondblclick="editSubtask(this)" class="subtask-title">${subtaskValue}</span>
      <div class="subtask-actions">
        <button type="button" class="edit-subtask-btn icon-edit" onclick="editSubtask(this)"></button>
        <button type="button" class="delete-subtask-btn icon-delete" onclick="deleteSubtask(this)"></button>
      </div>
    `;
}

/**
 * Resets the subtask input field and updates the button states.
 *
 * @param {string} formId - The ID of the form.
 */
function resetSubtaskInput(formId) {
  let subtaskInput = getSubtaskInput(formId);
  let addBtn = document.querySelector(`${formId} .add-subtask-btn`);
  let clearBtn = document.querySelector(`${formId} .clear-subtask-btn`);
  subtaskInput.value = "";
  addBtn.classList.remove("icon-check");
  addBtn.classList.add("icon-add");
  clearBtn.style.display = "none";
}

/**
 * Initializes subtask editing by replacing the title with an input field and displaying the save button.
 *
 * @param {HTMLElement} button - The edit button clicked to initiate editing.
 */
function editSubtask(button) {
  let listItem = button.parentElement.parentElement;
  let inputField = createEditInputField(listItem);
  toggleEditButtonVisibility(button, false);
  let saveBtn = createSaveButton(listItem, button, inputField);
  handleSaveOnEnter(inputField, saveBtn, listItem, button);
}

/**
 * Creates an input field for editing the subtask title.
 *
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @returns {HTMLInputElement} - The created input field.
 */
function createEditInputField(listItem) {
  let subtaskTitle = listItem.querySelector(".subtask-title");
  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = subtaskTitle.textContent;
  inputField.classList.add("edit-input");
  listItem.replaceChild(inputField, subtaskTitle);
  inputField.focus();
  return inputField;
}

/**
 * Creates the save button and appends it to the actions container.
 *
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @param {HTMLElement} button - The original edit button.
 * @param {HTMLInputElement} inputField - The input field for editing.
 * @returns {HTMLElement} - The created save button.
 */
function createSaveButton(listItem, button, inputField) {
  let saveBtn = document.createElement("button");
  saveBtn.classList.add("save-subtask-btn", "icon-check");
  let actionsContainer = button.parentElement;
  actionsContainer.appendChild(saveBtn);
  saveBtn.addEventListener("click", function () {
    finalizeEdit(listItem, inputField, button, saveBtn);
  });
  return saveBtn;
}

/**
 * Toggles the visibility of the edit button.
 *
 * @param {HTMLElement} button - The edit button.
 * @param {boolean} visible - Visibility state for the button.
 */
function toggleEditButtonVisibility(button, visible) {
  button.style.display = visible ? "inline-block" : "none";
}

/**
 * Saves the subtask edit when the Enter key is pressed.
 *
 * @param {HTMLInputElement} inputField - The input field for editing.
 * @param {HTMLElement} saveBtn - The save button.
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @param {HTMLElement} button - The original edit button.
 */
function handleSaveOnEnter(inputField, saveBtn, listItem, button) {
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      finalizeEdit(listItem, inputField, button, saveBtn);
    }
  });
}

/**
 * Finalizes the subtask edit by replacing the input field with updated text and restoring the edit button.
 *
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @param {HTMLInputElement} inputField - The input field for editing.
 * @param {HTMLElement} button - The original edit button.
 * @param {HTMLElement} saveBtn - The save button to remove after saving.
 */
function finalizeEdit(listItem, inputField, button, saveBtn) {
  saveSubtaskEdit(listItem, inputField);
  toggleEditButtonVisibility(button, true);
  saveBtn.remove();
}

/**
 * Replaces the input field with the updated subtask title if not empty.
 *
 * @param {HTMLElement} listItem - The subtask container.
 * @param {HTMLElement} inputField - The input field with the new title.
 */
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
 * Clears the value of the subtask input field in a specific form.
 *
 * @param {string} formId - The ID of the form element.
 */
function clearSubtaskInput(formId) {
  let subtaskInput = document.querySelector(`${formId} *[name = subtasks]`);
  subtaskInput.value = "";
}
