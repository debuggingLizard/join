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
  sortedContacts.forEach(contact => {
    assigneesListElement.innerHTML += getAssigneesListTemplate(contact, assignedUsers);
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
    <label for="${contact.id}" class='${assignedUsers.includes(contact.id) ? 'active' : ''}'>
      <div>
        <span class="contact-profile-image" style="background-color:${contact.color}">${contact.profileImage}</span>
        <span class="contact-profile-name">${contact.name}</span>
      </div>
      <input type="checkbox" ${assignedUsers.includes(contact.id) ? 'checked' : ''} id="${contact.id}" value="${contact.id}" name="contact" data-id="${contact.id}" data-color="${contact.color}" data-initials="${contact.profileImage}" onclick="styleLabel(this)">
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
      const id = checkbox.dataset.id;
      const color = checkbox.dataset.color;
      const initials = checkbox.dataset.initials;
      assignedContactsDiv.innerHTML += `<span id="${id}" class="contact-profile-image" style="background-color:${color}">${initials}</span>`;
    } else {
      const spanToRemove = Array.from(assignedContactsDiv.children).find(
        (span) => span.id === checkbox.id
      );
      if (spanToRemove) {
        assignedContactsDiv.removeChild(spanToRemove);
      }
    }
  });
}

/**
 * Styles the label of a checkbox when selected or deselected.
 * Changes background and text color based on checkbox state.
 * @param {HTMLInputElement} checkbox - The checkbox element to style.
 */
function styleLabel(checkbox) {
  let label = checkbox.parentElement;
  if (checkbox.checked) {
    label.classList.add('active');
  } else {
    label.classList.remove('active');
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
    categorySelect.innerHTML += /*html*/ `
      <option value="${id}">${categories[id].title}</option>
    `;
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
  document.querySelector(`${formId} .prio-btn.${selected}`).classList.add("active");
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
  initDateInput('#add-task-form');
  initSubtaskFunctions('#add-task-form');

  let formFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  formFields.forEach((field) => {
    field.addEventListener("input", checkRequiredFields);
  });
  checkRequiredFields();

  initContactDropdownList('#add-task-form');
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
 * Initializes the subtask functions within a form, enabling the addition of subtasks with the "Enter" key,
 * displaying clear and add buttons based on input, and allowing for subtask editing on double-click.
 *
 * @param {string} formId - The CSS selector for the form containing the subtask input, 
 *                          clear and add buttons, and the subtask list.
 *                          This should include the form's ID (e.g., "#myForm").
 */
function initSubtaskFunctions(formId) {
  let subtaskInput = document.querySelector(`${formId} *[name = subtasks]`);
  let clearSubtaskBtn = document.querySelector(`${formId} .clear-subtask-btn`);
  let addBtn = document.querySelector(`${formId} .add-subtask-btn`);
  let subtaskList = document.querySelector(`${formId} .subtask-list`);
  if (subtaskInput) {
    subtaskInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addSubtask();
      }
    });

    subtaskInput.addEventListener("input", function () {
      if (subtaskInput.value.length > 0) {
        clearSubtaskBtn.style.display = "flex";
        addBtn.classList.remove("icon-add");
        addBtn.classList.add("icon-check");
      } else {
        clearSubtaskBtn.style.display = "none";
        addBtn.classList.remove("icon-check");
        addBtn.classList.add("icon-add");
      }
    });

    clearSubtaskBtn.addEventListener("click", function () {
      subtaskInput.value = "";
      clearSubtaskBtn.style.display = "none";
      addBtn.classList.remove("icon-check");
      addBtn.classList.add("icon-add");
    });

    subtaskList.addEventListener("dblclick", function (event) {
      if (event.target && event.target.classList.contains("subtask-title")) {
        let editButton =
          event.target.parentElement.querySelector(".edit-subtask-btn");
        editSubtask(editButton);
      }
    });
  }
}
/**
 * Toggles the visibility of the contact dropdown list and updates the label's style 
 * to reflect its open or closed state.
 *
 * @param {string} formId - The CSS selector for the form containing the assignees list 
 *                          dropdown and the assign label. This should include the form's ID (e.g., "#myForm").
 */
function toggleContactDropdown(formId) {
  document.querySelector(`${formId} .assignees-list`).classList.toggle("d-none");
  document.querySelector(`${formId} .assign-label`).classList.toggle('open');
}
/**
 * Toggles the open state of the category label, updating its style to reflect 
 * whether the dropdown is open or closed.
 */
function categoryDropDown() {
  document.querySelector(".category-label").classList.toggle("open");
}

/**
 * Adds a new subtask, clears the input field, resets the add button to '+', and hides the clear button.
 */
function addSubtask(formId) {
  let subtaskInput = document.querySelector(`${formId} *[name = subtasks]`);
  let subtaskValue = subtaskInput.value.trim();
  let addBtn = document.querySelector(`${formId} .add-subtask-btn`);
  let clearBtn = document.querySelector(`${formId} .clear-subtask-btn`);
  if (subtaskValue) {
    let subtaskList = document.querySelector(`${formId} .subtask-list`);
    let listItem = document.createElement("li");
    listItem.classList.add("subtask-item");
    listItem.innerHTML = `
      <span ondbclick="editSubtask(this)" class="subtask-title">${subtaskValue}</span>
      <div class="subtask-actions">
        <button type="button" class="edit-subtask-btn icon-edit" onclick="editSubtask(this)"></button>
        <button type="button" class="delete-subtask-btn icon-delete" onclick="deleteSubtask(this)"></button>
      </div>
    `;
    subtaskList.appendChild(listItem);
    subtaskInput.value = "";
    addBtn.classList.remove("icon-check");
    addBtn.classList.add("icon-add");
    clearBtn.style.display = "none";
  }
}

/**
 * Enables inline subtask editing with an input field.
 * Save changes by clicking the checkmark or pressing Enter.
 *
 * @param {HTMLElement} button - The edit button clicked.
 */
function editSubtask(button) {
  let listItem = button.parentElement.parentElement;
  let subtaskTitle = listItem.querySelector(".subtask-title");
  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = subtaskTitle.textContent;
  inputField.classList.add("edit-input");
  listItem.replaceChild(inputField, subtaskTitle);
  button.style.display = "none";
  let saveBtn = document.createElement("button");
  saveBtn.classList.add("save-subtask-btn");
  saveBtn.classList.add("icon-check");
  let actionsContainer = button.parentElement;
  actionsContainer.appendChild(saveBtn);
  saveBtn.addEventListener("click", function () {
    saveSubtaskEdit(listItem, inputField);
    button.style.display = "inline-block";
    saveBtn.remove();
  });
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveSubtaskEdit(listItem, inputField);
      button.style.display = "inline-block";
      saveBtn.remove();
    }
  });
  inputField.focus();
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
 * Checks if all required fields are filled and enables/disables the "Create Task" button.
 */
function checkRequiredFields() {
  let requiredFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let allFilled = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false;
    }
  });

  const dateInput = document.querySelector("#add-task-form *[name = due-date]");
  if (dateInput.value === "dd/mm/yyyy") {
    allFilled = false;
  }

  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.disabled = !allFilled;
}

/**
 * Collects input values and creates a new task with title, description, assigned users, date, priority, category, and subtasks.
 * Resets the form and posts the task data to storage.
 */
async function createTask() {
  let title = document.querySelector("#add-task-form *[name = title]").value;
  let description = document.querySelector("#add-task-form *[name = description]").value || '';
  let assignedSpans = document.querySelector("#add-task-form .assigned-to").querySelectorAll("span");
  let users = Array.from(assignedSpans).map((span) => span.id);
  let date = document.querySelector("#add-task-form *[name = due-date]").value;
  let priority = document.querySelector("#add-task-form *[name = prio]").value;
  let category = document.getElementById("category").value;

  let subtasks = Array.from(document.querySelector("#add-task-form .subtask-list").children).map((li) => ({
    done: li.querySelector(".subtask-title").getAttribute('status') == 'true' ? true : false,
    title: li.querySelector(".subtask-title").textContent,
  }));
  let status = addTaskstatus;

  const data = {
    title: title,
    description: description,
    users: users.length > 0 ? users : [],
    date: date,
    priority: priority,
    category: category,
    subtasks: subtasks.length > 0 ? subtasks : [],
    status: status,
  };

  resetAddTask();
  await postData("tasks", data);
  addTaskstatus = "todo";
  showFeedbackOverlay();
}

/**
 * Resets the add task form, clearing inputs, unchecking checkboxes, removing validation errors, and setting defaults.
 */
function resetAddTask() {
  document.querySelector("#add-task-form *[name = title]").value = "";
  hideInputValidationError("#add-task-form", "title");
  createFormErrors["title"] = 0;

  document.querySelector("#add-task-form *[name = description]").value = "";
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    styleLabel(checkbox);
  });
  document.querySelector("#add-task-form .assigned-to").innerHTML = "";
  document.querySelector("#add-task-form *[name = due-date]").value = "";
  hideInputValidationError("#add-task-form", "due-date");
  createFormErrors["dueDate"] = 0;

  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.medium`).classList.add("active");
  document.getElementById("selectedPrio").value = "-O9M0Iky4rEYMLq5Jwo_";
  document.getElementById("category").value = "";
  hideInputValidationError("#add-task-form", "category");
  createFormErrors["category"] = 0;

  document.querySelector("#add-task-form .subtask-list").innerHTML = "";
  setPlaceholder("#add-task-form");
  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.disabled = true;
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
  let newValue = '';
  if (dateInput.value !== "dd/mm/yyyy") {    
    newValue = convertDateFormatWithDash(dateInput.value);
  }

  dateInput.value = '';
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
  const selectedDate = new Date(dateInput.value);
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const year = selectedDate.getFullYear();

  dateInput.setAttribute("type", "text");
  dateInput.classList.add("text-date");
  dateInput.blur();
  dateInput.value = `${day}/${month}/${year}`;
}

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
