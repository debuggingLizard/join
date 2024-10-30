let addTaskstatus = "todo";
let createFormErrors = {
  title: 0,
  dueDate: 0,
  category: 0,
};

/**
 * Renders the add task form with contacts and categories, and validates input on submit.
 * Listens for form submission, checks required fields, and creates the task if valid.
 */
async function renderAddTaskData() {
  await renderContacts("#add-task-form");
  await renderCategories();
  initializeTaskForm();
}

function initializeTaskForm() {
  let formElement = document.getElementById("add-task-form");
  formElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    checkCreateInputValidation("title", "The title field is required");
    checkCreateInputValidation("due-date", "The Date field is required");
    checkCreateInputValidation("category", "The Category field is required");
    if (
      createFormErrors.title === 0 &&
      createFormErrors.dueDate === 0 &&
      createFormErrors.category === 0
    ) {
      await createTask();
      if (typeof renderTaskAfterCreateTask === "function") {
        await renderTaskAfterCreateTask();
      }
    }
  });
}

/**
 * Validates a specific form input; shows or hides error messages.
 * @param {string} inputName - The name of the input field to validate.
 * @param {string} message - The error message to display if validation fails.
 */
function checkCreateInputValidation(inputName, message) {
  let inputElement = document.querySelector(
    `#add-task-form *[name = ${inputName}]`
  );
  if (!inputElement.checkValidity()) {
    showInputValidationError("#add-task-form", inputName, message);
    createFormErrors[inputName] = 1;
  } else {
    hideInputValidationError("#add-task-form", inputName);
    createFormErrors[inputName] = 0;
  }
  if (inputElement.value === "dd/mm/yyyy") {
    showInputValidationError("#add-task-form", inputName, message);
    createFormErrors[inputName] = 1;
  }
}

/**
 * Fetches and sorts contacts, renders them in the assignees list, and updates assignments.
 */
async function renderContacts(form, assignedUsers = []) {
  let contacts = await getData("users");
  let sortedContacts = Object.keys(contacts)
    .map((id) => ({ id, ...contacts[id] }))
    .sort((a, b) => a.name.localeCompare(b.name));
  let assigneesListElement = document.querySelector(`${form} .assignees-list`);
  assigneesListElement.innerHTML = "";
  sortedContacts.forEach((contact) => {
    assigneesListElement.innerHTML += getAssigneesListTemplate(
      contact,
      assignedUsers
    );
  });
  updateAssignedContacts(form);
}

/**
 * Generates the HTML template for an assignee contact with a profile image, name, and checkbox.
 * @param {object} contact - The contact data, including id, color, profileImage, and name.
 * @returns {string} HTML template for the contact element.
 */
function getAssigneesListTemplate(contact, assignedUsers = []) {
  return /*html*/ `
    <label for="${contact.id}" class='${
    assignedUsers.includes(contact.id) ? "active" : ""
  }'>
      <div>
        <span class="contact-profile-image" style="background-color:${
          contact.color
        }">${contact.profileImage}</span>
        <span class="contact-profile-name">${contact.name}</span>
      </div>
      <input type="checkbox" ${
        assignedUsers.includes(contact.id) ? "checked" : ""
      } id="${contact.id}" 
      value="${contact.id}" name="contact" data-id="${contact.id}" 
      data-color="${contact.color}" data-initials="${
    contact.profileImage
  }" onclick="styleLabel(this)">
    </label>
  `;
}

/**
 * Updates assigned contacts display based on selected checkboxes.
 * Adds or removes contact profile images in the assigned contacts section.
 */
function updateAssignedContacts(form) {
  let assigneesListElement = document.querySelector(`${form} .assignees-list`);
  assigneesListElement.addEventListener("change", function (event) {
    const checkbox = event.target;
    const assignedContactsDiv = document.querySelector(`${form} .assigned-to`);
    if (checkbox.checked) {
      addAssignedContact(checkbox, assignedContactsDiv);
    } else {
      removeAssignedContact(checkbox, assignedContactsDiv);
    }
  });
}

function addAssignedContact(checkbox, assignedContactsDiv) {
  const id = checkbox.dataset.id;
  const color = checkbox.dataset.color;
  const initials = checkbox.dataset.initials;
  assignedContactsDiv.innerHTML += `<span id="${id}" class="contact-profile-image" style="background-color:${color}">${initials}</span>`;
}

function removeAssignedContact(assignedContactsDiv, checkbox) {
  const spanToRemove = Array.from(assignedContactsDiv.children).find(
    (span) => span.id === checkbox.id
  );
  if (spanToRemove) {
    assignedContactsDiv.removeChild(spanToRemove);
  }
}

/**
 * Styles the label of a checkbox when selected or deselected.
 * Changes background and text color based on checkbox state.
 * @param {HTMLInputElement} checkbox - The checkbox element to style.
 */
function styleLabel(checkbox) {
  let label = checkbox.parentElement;
  if (checkbox.checked) {
    label.classList.add("active");
  } else {
    label.classList.remove("active");
  }
}

/**
 * Fetches categories and populates the category dropdown menu.
 * Sets a default placeholder option for category selection.
 */
async function renderCategories() {
  let categories = await getData("categories");
  let categorySelect = document.getElementById("category");
  categorySelect.innerHTML =
    '<option value="" disabled selected hidden>Select task category</option>';
  Object.keys(categories).forEach((id) => {
    categorySelect.innerHTML += `<option value="${id}">${categories[id].title}</option>`;
  });
}

/**
 * Sets the selected priority button as active and removes the active class from others.
 *
 * @param {string} selected - The class name of the selected priority button.
 */
function selectPrio(formId, selected, id) {
  document.querySelectorAll(`${formId} .prio-btn`).forEach((button) => {
    button.classList.remove("active");
  });
  document
    .querySelector(`${formId} .prio-btn.${selected}`)
    .classList.add("active");
  document.querySelector(`${formId} *[name = prio]`).value = id;
}

/**
 * Initializes event listeners and validations:
 * - Sets the minimum date for the due date and prevents selecting past dates.
 * - Manages subtask input: shows/hides the clear button, toggles the add button, and enables subtask editing.
 * - Validates required fields and enables/disables the "Create Task" button.
 * - Assignees list can be close by clicking outside of list/input
 */
function initEventListenerAddTask() {
  initDateInput("#add-task-form");
  initSubtaskFunctions("#add-task-form");
  initFormFieldListeners("#add-task-form");
  checkRequiredFields();
  initContactDropdownList("#add-task-form");
}

/**
 * Initializes the minimum date for a date input field to today's date.
 * Ensures that the selected date cannot be set before the current date.
 *
 * @param {string} formId - The CSS selector for the form containing the date input.
 *                           This should include the form's ID (e.g., "#myForm").
 */
function initDateInput(formId) {
  let dueDateInput = document.querySelector(`${formId} *[name = due-date]`);
  let today = new Date().toISOString().split("T")[0];
  if (dueDateInput) {
    dueDateInput.setAttribute("min", today);
  }
}

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
    handleSubtaskInput(subtaskInput, addBtn, clearSubtaskBtn);
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
function handleSubtaskInput(input, addBtn, clearBtn) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
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
 * Initializes input listeners on required form fields to trigger validation.
 * Adds an "input" event listener to each required field (input, select, textarea)
 * in the specified form, which calls the `checkRequiredFields` function on change.
 *
 * @param {string} formSelector - CSS selector for the form containing required fields.
 */
function initFormFieldListeners(formSelector) {
  let formFields = document.querySelectorAll(
    `${formSelector} input[required], ${formSelector} select[required], ${formSelector} textarea[required]`
  );
  formFields.forEach((field) => {
    field.addEventListener("input", checkRequiredFields);
  });
}

/**
 * Checks if all required fields are filled and enables/disables the "Create Task" button.
 */
function checkRequiredFields() {
  let requiredFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let allFilled = Array.from(requiredFields).every(
    (field) => field.value.trim() !== ""
  );
  const dateInput = document.querySelector("#add-task-form *[name = due-date]");
  if (dateInput.value === "dd/mm/yyyy") {
    allFilled = false;
  }
  toggleCreateTaskButton(allFilled);
}

/**
 * Toggles the enabled state of the "Create Task" button.
 *
 * @param {boolean} enabled - If true, enables the button; otherwise, disables it.
 */
function toggleCreateTaskButton(enabled) {
  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.disabled = !enabled;
}

/**
 * Initializes a contact dropdown list, adding functionality to hide the dropdown
 * when clicking outside of the input field or dropdown list.
 *
 * @param {string} formId - The CSS selector for the form containing the assignee input
 *                          and dropdown list. This should include the form's ID (e.g., "#myForm").
 */
function initContactDropdownList(formId) {
  document.addEventListener("click", function (event) {
    const input = document.querySelector(`${formId} *[name = assignees]`);
    const dropdown = document.querySelector(`${formId} .assignees-list`);
    if (!input.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.add("d-none");
    }
  });
}

/**
 * Toggles the visibility of the contact dropdown list and updates the label's style
 * to reflect its open or closed state.
 *
 * @param {string} formId - The CSS selector for the form containing the assignees list
 *                          dropdown and the assign label. This should include the form's ID (e.g., "#myForm").
 */
function toggleContactDropdown(formId) {
  document
    .querySelector(`${formId} .assignees-list`)
    .classList.toggle("d-none");
  document.querySelector(`${formId} .assign-label`).classList.toggle("open");
}

/**
 * Toggles the open state of the category label, updating its style to reflect
 * whether the dropdown is open or closed.
 */
function categoryDropDown() {
  document.querySelector(".category-label").classList.toggle("open");
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
  listItem.innerHTML = `
    <span ondblclick="editSubtask(this)" class="subtask-title">${subtaskValue}</span>
    <div class="subtask-actions">
      <button type="button" class="edit-subtask-btn icon-edit" onclick="editSubtask(this)"></button>
      <button type="button" class="delete-subtask-btn icon-delete" onclick="deleteSubtask(this)"></button>
    </div>
  `;
  return listItem;
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
 * Clears the subtask input field.
 */
function clearSubtaskInput(formId) {
  let subtaskInput = document.querySelector(`${formId} *[name = subtasks]`);
  subtaskInput.value = "";
}

/**
 * Collects input values and creates a new task.
 * Resets the form and posts the task data to storage.
 */
async function createTask() {
  const data = gatherTaskData();
  resetAddTask();
  await postData("tasks", data);
  addTaskstatus = "todo";
  showFeedbackOverlay();
}

/**
 * Gathers task data from form inputs, including title, description, assigned users, date, priority, category, and subtasks.
 * @returns {Object} An object containing the task data.
 */
function gatherTaskData() {
  return {
    title: getInputValue("#add-task-form *[name = title]"),
    description: getInputValue("#add-task-form *[name = description]"),
    users: getAssignedUsers(),
    date: getInputValue("#add-task-form *[name = due-date]"),
    priority: getInputValue("#add-task-form *[name = prio]"),
    category: getInputValue("#category"),
    subtasks: getSubtasks(),
    status: addTaskstatus,
  };
}

/**
 * Retrieves the value from a form input field.
 * @param {string} selector - The selector for the input field.
 * @returns {string} The input value or an empty string if not found.
 */
function getInputValue(selector) {
  return document.querySelector(selector)?.value || "";
}

/**
 * Collects assigned user IDs from the form.
 * @returns {Array<string>} An array of assigned user IDs.
 */
function getAssignedUsers() {
  const assignedSpans = document.querySelectorAll(
    "#add-task-form .assigned-to span"
  );
  return Array.from(assignedSpans).map((span) => span.id);
}

/**
 * Collects subtasks from the form, with each subtask containing its title and completion status.
 * @returns {Array<Object>} An array of subtasks.
 */
function getSubtasks() {
  const subtasks = document.querySelector(
    "#add-task-form .subtask-list"
  ).children;
  return Array.from(subtasks).map((li) => ({
    done: li.querySelector(".subtask-title").getAttribute("status") === "true",
    title: li.querySelector(".subtask-title").textContent,
  }));
}

/**
 * Clears input fields for title, description, due date, and assigned users,
 * and resets validation errors for each field.
 */
function resetFormInputs() {
  document.querySelector("#add-task-form *[name = title]").value = "";
  hideInputValidationError("#add-task-form", "title");
  createFormErrors["title"] = 0;

  document.querySelector("#add-task-form *[name = description]").value = "";
  document.querySelector("#add-task-form .assigned-to").innerHTML = "";

  document.querySelector("#add-task-form *[name = due-date]").value = "";
  hideInputValidationError("#add-task-form", "due-date");
  createFormErrors["dueDate"] = 0;
}

/**
 * Resets additional form elements including checkboxes, priority buttons,
 * category selection, subtasks, and disables the "Create Task" button.
 */
function resetAdditionalElements() {
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
    styleLabel(checkbox);
  });
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(".prio-btn.medium").classList.add("active");
  document.getElementById("selectedPrio").value = "-O9M0Iky4rEYMLq5Jwo_";
  document.getElementById("category").value = "";
  hideInputValidationError("#add-task-form", "category");
  createFormErrors["category"] = 0;
  document.querySelector("#add-task-form .subtask-list").innerHTML = "";
  setPlaceholder("#add-task-form");
  document.getElementById("createTaskBtn").disabled = true;
}

/**
 * Fully resets the add task form by calling functions to reset inputs and additional elements.
 */
function resetAddTask() {
  resetFormInputs();
  resetAdditionalElements();
}

/**
 * Sets a placeholder for the due date input if it is empty and switches input type to text.
 */
function setPlaceholder(formId) {
  const dateInput = document.querySelector(`${formId} *[name = due-date]`);
  dateInput.setAttribute("type", "text");
  if (dateInput.value === "") {
    dateInput.value = "dd/mm/yyyy"; // Placeholder text
    dateInput.classList.remove("text-date");
  }
}

/**
 * Clears the placeholder for the due date input and switches type back to date, showing the date picker.
 */
function clearPlaceholder(formId) {
  const dateInput = document.querySelector(`${formId} *[name = due-date]`);
  let newValue = "";
  if (dateInput.value !== "dd/mm/yyyy") {
    newValue = convertDateFormatWithDash(dateInput.value);
  }
  dateInput.value = "";
  dateInput.setAttribute("type", "date"); // Switch back to date type
  dateInput.classList.remove("text-date");
  setTimeout(() => {
    dateInput.value = newValue;
    dateInput.showPicker();
  }, 300);
}

/**
 * Formats the selected date as "dd/mm/yyyy" and switches input type to text for display.
 */
function formatDate(formId) {
  const dateInput = document.querySelector(`${formId} *[name = due-date]`);
  if (dateInput.value !== "") {
    const selectedDate = new Date(dateInput.value);
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const year = selectedDate.getFullYear();
    dateInput.setAttribute("type", "text");
    dateInput.classList.add("text-date");
    dateInput.blur();
    dateInput.value = `${day}/${month}/${year}`;
  }
}

/**
 * Converts a date from "dd/mm/yyyy" format to "yyyy-mm-dd" format.
 * @param {string} dateString - The date in "dd/mm/yyyy" format.
 * @returns {string} The date formatted as "yyyy-mm-dd".
 */
function convertDateFormatWithDash(dateString) {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

/**
 * Displays the feedback overlay by adding the "show" class to the overlay element.
 * Removes the "show" class after 1 second to hide the overlay.
 */
function showFeedbackOverlay() {
  const overlay = document.getElementById("feedback-overlay");
  overlay.classList.add("show");
  setTimeout(() => {
    overlay.classList.remove("show");
  }, 1000);
}
