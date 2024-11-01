/**
 * Creates a new task by gathering task data, resetting the add task form,
 * posting the data to the server, setting the task status to "todo",
 * and displaying a feedback overlay. After the feedback overlay is shown,
 * it redirects to the board page if currently on the add task page.
 *
 * @returns {Promise<void>}
 */
async function createTask() {
    const data = gatherTaskData();
    resetAddTask();
    await postData("tasks", data);
    addTaskstatus = "todo";
    showFeedbackOverlay(() => {
      if (window.location.pathname.endsWith('addTask.html')) {
        window.location.href = './board.html';
      }
    });
  }
  
  /**
   * Gathers task data from the add task form, including title, description, assigned users,
   * due date, priority, category, subtasks, and status.
   *
   * @returns {Object} - An object containing the gathered task data.
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
   * Sets the placeholder text for the due date input field within the specified form.
   * If the input field is empty, it sets the value to "dd/mm/yyyy" and removes the "text-date" class.
   *
   * @param {string} formId - The selector of the form containing the due date input field.
   */
  function setPlaceholder(formId) {
    const dateInput = document.querySelector(`${formId} *[name = due-date]`);
    dateInput.setAttribute("type", "text");
    if (dateInput.value === "") {
      dateInput.value = "dd/mm/yyyy";
      dateInput.classList.remove("text-date");
    }
  }
  
  /**
   * Clears the placeholder text for the due date input field within the specified form.
   * If the current value is not the default "dd/mm/yyyy", it converts the date format,
   * clears the input, sets the type to "date", and shows the date picker.
   *
   * @param {string} formId - The selector of the form containing the due date input field.
   */
  function clearPlaceholder(formId) {
    const dateInput = document.querySelector(`${formId} *[name = due-date]`);
    let newValue = "";
    if (dateInput.value !== "dd/mm/yyyy") {
      newValue = convertDateFormatWithDash(dateInput.value);
    }
    dateInput.value = "";
    dateInput.setAttribute("type", "date");
    dateInput.classList.remove("text-date");
    setTimeout(() => {
      dateInput.value = newValue;
      dateInput.showPicker();
    }, 300);
  }
  
  /**
   * Formats the value of the due date input field within the specified form.
   * Converts the selected date to the format "dd/mm/yyyy" and updates the input field.
   * Additionally, changes the input type to "text" and adds the "text-date" class.
   *
   * @param {string} formId - The selector of the form containing the due date input field.
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
 * Displays a feedback overlay and removes it after a short delay.
 * If a callback function is provided, it is executed after the overlay is hidden.
 *
 * @param {Function} [callBack] - An optional callback function to be executed after the overlay is hidden.
 */
  function showFeedbackOverlay(callBack) {
    const overlay = document.getElementById("feedback-overlay");
    overlay.classList.add("show");
    setTimeout(() => {
      overlay.classList.remove("show");
      if (callBack) {
        callBack();
      }
    }, 1000);
  }