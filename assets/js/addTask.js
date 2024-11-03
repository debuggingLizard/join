let addTaskstatus = "todo";
let createFormErrors = {
  title: 0,
  dueDate: 0,
  category: 0,
};

/**
 * Initializes various event listeners and functions for the add task form.
 * This includes initializing date input, subtask functions, form field listeners,
 * required field checks, and the contact dropdown list.
 */
function initEventListenerAddTask() {
  initDateInput("#add-task-form");
  initSubtaskFunctions("#add-task-form");
  initFormFieldListeners("#add-task-form");
  checkRequiredFields();
  initContactDropdownList("#add-task-form");
}

/**
 * Initializes the date input field within the specified form.
 * Sets the minimum date attribute of the due date input field to today's date.
 *
 * @param {string} formId - The selector of the form containing the due date input field.
 */
function initDateInput(formId) {
  let dueDateInput = document.querySelector(`${formId} *[name = due-date]`);
  let today = new Date().toISOString().split("T")[0];
  if (dueDateInput) {
    dueDateInput.setAttribute("min", today);
  }
}

/**
 * Initializes event listeners for all required form fields within the specified form.
 * Adds an 'input' event listener to each required input, select, and textarea field
 * to trigger the `checkRequiredFields` function when the field value changes.
 *
 * @param {string} formSelector - The selector of the form containing the required fields.
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
 * Initializes the contact dropdown list within the specified form.
 * Adds a document-wide click event listener to hide the dropdown list
 * if the click occurs outside of the input field or the dropdown list.
 *
 * @param {string} formId - The selector of the form containing the assignees input and dropdown list.
 */
function initContactDropdownList(formId) {
  document.addEventListener("click", function (event) {
    const input = document.querySelector(`${formId} *[name = assignees]`);
    const dropdown = document.querySelector(`${formId} .assignees-list`);
    if (input && dropdown) {
      if (!input.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.add("d-none");
      }
    }
  });
}

/**
 * Toggles the visibility of the contact dropdown list and the open state of the assign label
 * within the specified form.
 *
 * @param {string} formId - The selector of the form containing the assignees list and assign label.
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
 * Renders the add task form with contacts and categories, and validates input on submit.
 * Listens for form submission, checks required fields, and creates the task if valid.
 */
async function renderAddTaskData() {
  await renderContacts("#add-task-form", []);
  await renderCategories();
  initializeTaskForm();
}

/**
 * Renders the list of contacts within the specified form. It fetches the contact data,
 * sorts the contacts by name, and updates the assignees list in the form.
 * Optionally, it can also mark certain users as already assigned.
 *
 * @param {string} form - The selector of the form in which to render the contacts.
 * @param {Array<string>} [assignedUsers=[]] - An array of user IDs that should be marked as assigned.
 * @returns {Promise<void>}
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
      form,
      contact,
      assignedUsers
    );
  });
  updateAssignedContacts(form);
}

/**
 * Generates the HTML template for an assignee list item, including a label and checkbox.
 * The template marks the contact as active and checked if they are in the assignedUsers array.
 *
 * @param {Object} contact - The contact object containing details such as id, color, and profileImage.
 * @param {Array<string>} [assignedUsers=[]] - An array of user IDs that are already assigned.
 * @returns {string} - The HTML string for the assignee list item.
 */
function getAssigneesListTemplate(form, contact, assignedUsers = []) {
  return /*html*/ `
    <label for="${form + contact.id}" class='${
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
      } id="${form + contact.id}" 
      value="${contact.id}" name="contact" data-id="${contact.id}" 
      data-color="${contact.color}" data-initials="${
    contact.profileImage
  }" onclick="styleLabel(this)">
    </label>
  `;
}

/**
 * Adds an event listener to update assigned contacts in the specified form.
 * @param {string} form - The selector of the form to update.
 */
function updateAssignedContacts(form) {
  let assigneesListElement = document.querySelector(`${form} .assignees-list`);
  assigneesListElement.addEventListener(
    "change",
    handleAssigneeChange.bind(null, form)
  );
}

/**
 * Manages the addition or removal of a contact based on checkbox state.
 * @param {string} form - The form selector for updating assigned contacts.
 * @param {Event} event - The event triggered by the checkbox change.
 */
function handleAssigneeChange(form, event) {
  const checkbox = event.target;
  const assignedContactsDiv = document.querySelector(`${form} .assigned-to`);
  if (checkbox.checked) {
    addContact(assignedContactsDiv, checkbox);
  } else {
    removeContact(assignedContactsDiv, checkbox);
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
 * Initializes the task form by adding a submit event listener.
 * Validates required fields (title, due date, category) before creating the task.
 * Calls renderTaskAfterCreateTask() if defined, after successful task creation.
 */
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
 * Validates the input element specified by its name within the create task form.
 * If the input is invalid or contains a default value, it shows an error message
 * and updates the error state in the `createFormErrors` object.
 *
 * @param {string} inputName - The name attribute of the input element to validate.
 * @param {string} message - The validation error message to display if the input is invalid.
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
 * Adds a contact with profile image to the assigned contacts section.
 * @param {HTMLElement} assignedContactsDiv - The element displaying assigned contacts.
 * @param {HTMLElement} checkbox - The checkbox element for the selected contact.
 */
function addContact(assignedContactsDiv, checkbox) {
  const { id, color, initials } = checkbox.dataset;
  assignedContactsDiv.innerHTML += `<span id="${id}" class="contact-profile-image" style="background-color:${color}">${initials}</span>`;
}

/**
 * Removes a contact from the assigned contacts section.
 * @param {HTMLElement} assignedContactsDiv - The element displaying assigned contacts.
 * @param {HTMLElement} checkbox - The checkbox element for the contact to remove.
 */
function removeContact(assignedContactsDiv, checkbox) {
  const spanToRemove = Array.from(assignedContactsDiv.children).find(
    (span) => span.id === checkbox.dataset.id
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
 * Updates the priority selection in the form by adding an active class to the selected button,
 * and updates the hidden input field with the selected priority ID.
 *
 * @param {string} formId - The ID of the form containing the priority buttons.
 * @param {string} selected - The class name of the selected priority button.
 * @param {string} id - The ID value to set in the hidden priority input field.
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
