async function renderAddTaskData() {
  await renderContacts();
  await renderCategories();
}

async function renderContacts() {
  let contacts = await getData("users");
  let sortedContacts = Object.keys(contacts)
    .map((id) => ({ id, ...contacts[id] }))
    .sort((a, b) => a.name.localeCompare(b.name));
  let assigneesList = document.getElementById("assignees-list");
  assigneesList.innerHTML = "";
  for (let i = 0; i < sortedContacts.length; i++) {
    assigneesList.innerHTML += getAssigneesListTemplate(sortedContacts[i]);
  }
  updateAssignedContacts();
}

function getAssigneesListTemplate(contact) {
  return /*html*/ `
    <label for="${contact.id}"><div><span class="contact-profile-image" style="background-color:${contact.color}">${contact.profileImage}</span><span>${contact.name}</span></div><input type="checkbox" id="${contact.id}" value="${contact.id}" name="contact" data-id="${contact.id}" data-color="${contact.color}" data-initials="${contact.profileImage}" onclick="styleLabel(this)"></label>
  `;
}

function updateAssignedContacts() {
  document
    .getElementById("assignees-list")
    .addEventListener("change", function (event) {
      const checkbox = event.target;
      const assignedContactsDiv = document.getElementById("assigned-to");
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

function styleLabel(checkbox) {
  let label = checkbox.parentElement;
  if (checkbox.checked) {
      label.style.backgroundColor = '#2A3647';
      label.style.color = 'white';
  } else {
      label.style.backgroundColor = '';
      label.style.color = '';
  }
}

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
function selectPrio(selected, id) {
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.${selected}`).classList.add("active");
  document.getElementById("selectedPrio").value = id;
}

/**
 * Initializes event listeners and validations:
 * - Sets the minimum date for the due date and prevents selecting past dates.
 * - Manages subtask input: shows/hides the clear button, toggles the add button, and enables subtask editing.
 * - Validates required fields and enables/disables the "Create Task" button.
 */
document.addEventListener("DOMContentLoaded", function () {
  let dueDateInput = document.getElementById("due-date");
  let today = new Date().toISOString().split("T")[0];
  if (dueDateInput) {
    dueDateInput.setAttribute("min", today);
    dueDateInput.addEventListener("change", function () {
      let selectedDate = new Date(dueDateInput.value);
      let today = new Date();
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        document.getElementById('incorrect-date').classList.remove('d-none')
        dueDateInput.value = "";
        setTimeout(function() {
          document.getElementById('incorrect-date').classList.add('d-none');
      }, 3000); 
      }
    });
  }
  let subtaskInput = document.getElementById("subtasks");
  let clearBtn = document.querySelector(".clear-subtask-btn");
  let addBtn = document.querySelector(".add-subtask-btn");
  let subtaskList = document.getElementById("subtask-list");
  if (subtaskInput) {
    subtaskInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addSubtask();
      }
    });
    subtaskInput.addEventListener("input", function () {
      if (subtaskInput.value.length > 0) {
        clearBtn.style.display = "flex";
        addBtn.classList.remove('icon-add');
        addBtn.classList.add('icon-check');
      } else {
        clearBtn.style.display = "none";
        addBtn.classList.remove('icon-check');
        addBtn.classList.add('icon-add');
      }
    });
    clearBtn.addEventListener("click", function () {
      subtaskInput.value = "";
      clearBtn.style.display = "none";
      addBtn.classList.remove('icon-check');
      addBtn.classList.add('icon-add');
    });
    subtaskList.addEventListener("dblclick", function (event) {
      if (event.target && event.target.classList.contains("subtask-title")) {
        let editButton =
          event.target.parentElement.querySelector(".edit-subtask-btn");
        editSubtask(editButton);
      }
    });
  }
  let formFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  formFields.forEach((field) => {
    field.addEventListener("input", checkRequiredFields);
  });
  checkRequiredFields();
});

function openContactDropdown() {
  document.getElementById("assignees-list").classList.remove("d-none");
}

document.addEventListener("click", function (event) {
  const input = document.getElementById("assignees");
  const dropdown = document.getElementById("assignees-list");
  if (!input.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.add("d-none");
  }
});

/**
 * Adds a new subtask, clears the input field, resets the add button to '+', and hides the clear button.
 */
function addSubtask() {
  let subtaskInput = document.getElementById("subtasks");
  let subtaskValue = subtaskInput.value.trim();
  let addBtn = document.querySelector(".add-subtask-btn");
  let clearBtn = document.querySelector(".clear-subtask-btn");
  if (subtaskValue) {
    let subtaskList = document.getElementById("subtask-list");
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
    addBtn.classList.remove('icon-check');
    addBtn.classList.add('icon-add');
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
function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtasks");
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
  let createTaskBtn = document.getElementById("createTaskBtn");
  createTaskBtn.disabled = !allFilled;

  // Log-Ausgabe, um den Status des Buttons zu prüfen
  if (allFilled) {
    console.log("Button ist aktiviert");
  } else {
    console.log("Button ist deaktiviert");
  }
}

async function createTask() {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value || '';
  let assignedSpans = document.getElementById("assigned-to").querySelectorAll("span");
  let users = Array.from(assignedSpans).map((span) => span.id);
  let date = document.getElementById("due-date").value;
  let priority = document.getElementById("selectedPrio").value;
  let category = document.getElementById("category").value;

  let subtasks = Array.from(document.getElementById("subtask-list").children).map((li) => ({
    done: false,
    title: li.querySelector(".subtask-title").textContent,
  }));
  let status = "todo";

  const data = {
    title: title,
    description: description,
    users: users.length > 0 ? users : [],
    date: date,
    priority: priority,
    category: category,
    subtasks: subtasks.length > 0 ? subtasks : [],
    status: status
  };

  if (!data.users || data.users.length === 0) {
    data.users = [];
}
if (!data.subtasks || data.subtasks.length === 0) {
    data.subtasks = [];
}

  console.log(data);
  resetAddTask();
  await postData("tasks", data);
}

function resetAddTask() {
  document.getElementById("title").value = '';
  document.getElementById("description").value = '';
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {checkbox.checked = false; styleLabel(checkbox);});
  document.getElementById("assigned-to").innerHTML = '';
  document.getElementById("due-date").value = '';
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.medium`).classList.add("active");
  document.getElementById("selectedPrio").value = '-O9M0Iky4rEYMLq5Jwo_';
  document.getElementById("category").value = '';
  document.getElementById("subtask-list").innerHTML = '';
}