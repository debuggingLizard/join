/**
 * Displays the greeting screen overlay on smaller screens (800px or less).
 * Adjusts the visibility of the main container and the greeting screen.
 *
 * @param {string} formId - The selector of the form containing the due date input field.
 */
function showGreetingScreen() {
  let greetingScreen = document.getElementById("greeting-container");
  let mainContainer = document.querySelector(".main");
  if (window.innerWidth <= 800) {
    setGreetingScreenVisibility(mainContainer, greetingScreen);
  }
}

/**
 * Sets the visibility of the greeting screen.
 * Temporarily hides the overflow of the main container, hides the greeting screen after a delay,
 * and then fully hides the greeting screen after an additional delay, resetting the overflow style.
 *
 * @param {Element} mainContainer - The main container element whose overflow style will be adjusted.
 * @param {Element} greetingScreen - The greeting screen element to be hidden.
 */
function setGreetingScreenVisibility(mainContainer, greetingScreen) {
  if(isMoveFromLoginPage()) {
    mainContainer.style.overflow = "hidden";
    setTimeout(() => {
      greetingScreen.classList.add("hidden");
      mainContainer.style.overflow = "";
      setTimeout(() => {
        greetingScreen.classList.add("no-show");
        greetingScreen.classList.remove("hidden");
      }, 1000);
    }, 1500);
    localStorage.removeItem("redirectFromLogin");
  } else {
    greetingScreen.classList.add("hidden");
    greetingScreen.classList.add("no-show");
    greetingScreen.classList.remove("hidden");
  }
}

/**
 * Renders summary data for tasks in various statuses.
 * Sets greeting, retrieves tasks, and displays task counts and urgent tasks.
 */
async function renderSummaryData() {
  setGreeting();
  let tasks = await getData("tasks");
  renderTasksAmountByStatus(tasks, "todo");
  renderTasksAmountByStatus(tasks, "done");
  renderUrgentTasks(tasks);
  renderAllTasksAmount(tasks);
  renderTasksAmountByStatus(tasks, "progress");
  renderTasksAmountByStatus(tasks, "await-feedback");
  showAdminName();
}

/**
 * Sets the greeting text in the greeting element.
 */
function setGreeting() {
  document.getElementById("greeting").innerText = getGreeting();
}

/**
 * Returns a greeting based on the current time of day.
 * - Morning: before 12 PM
 * - Afternoon: 12 PM to 6 PM
 * - Evening: after 6 PM
 * @returns {string} Appropriate greeting message.
 */
function getGreeting() {
  let now = new Date();
  let hours = now.getHours();
  let greeting;
  switch (true) {
    case hours < 12:
      greeting = "Good Morning" + commaForGreeting();
      break;
    case hours < 18:
      greeting = "Good Afternoon" + commaForGreeting();
      break;
    default:
      greeting = "Good Evening" + commaForGreeting();
  }
  return greeting;
}

/**
 * Returns , if admin login
 * @returns {string}.
 */
function commaForGreeting() {
  return isAdminLogin() ? "," : "";
}

/**
 * Updates the displayed count of tasks for a specified status.
 * Iterates over tasks to count the number matching the given status and updates the DOM.
 * @param {Object} tasks - All tasks data.
 * @param {string} status - Status type to filter and count tasks by.
 */
function renderTasksAmountByStatus(tasks, status) {
  let statusAmount = document.getElementById(status + "-tasks-amount");
  let amount = 0;
  for (const key in tasks) {
    if (tasks[key].status === status) {
      amount++;
    }
  }
  statusAmount.innerHTML = amount;
}

/**
 * Renders the count and next deadline of urgent tasks based on priority.
 * Fetches priority ID, calculates the count and nearest deadline of urgent tasks,
 * and updates the respective DOM elements.
 * @param {Object} tasks - All tasks data.
 */
async function renderUrgentTasks(tasks) {
  let priority = await getPriorityID();
  let amount = getUrgentTasksAmount(tasks, priority);
  let nextDeadline = getNextUrgentDeadline(tasks, priority);
  document.getElementById("urgent-tasks-amount").innerHTML = amount;
  document.getElementById("next-deadline").innerHTML =
    nextDeadline.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
}

/**
 * Retrieves the priority ID for tasks marked as "Urgent".
 * Fetches priority data and finds the ID corresponding to the "Urgent" priority title.
 * @returns {string} - The ID of the "Urgent" priority.
 */
async function getPriorityID() {
  let priorities = await getData("priorities");
  let priority;
  for (const key in priorities) {
    if (priorities[key].title === "Urgent") {
      priority = key;
    }
  }
  return priority;
}

/**
 * Counts the number of tasks with the specified urgent priority.
 * @param {Object} tasks - Collection of all tasks.
 * @param {string} priority - Priority ID to match for urgent tasks.
 * @returns {number} - Count of urgent tasks.
 */
function getUrgentTasksAmount(tasks, priority) {
  let amount = 0;
  for (const key in tasks) {
    if (tasks[key].priority === priority) {
      amount++;
    }
  }
  return amount;
}

/**
 * Finds the earliest deadline among tasks with the specified urgent priority.
 * @param {Object} tasks - Collection of all tasks.
 * @param {string} priority - Priority ID to match for urgent tasks.
 * @returns {Date|null} - The date of the next urgent deadline, or null if none found.
 */
function getNextUrgentDeadline(tasks, priority) {
  let nextDeadline = null;
  for (const key in tasks) {
    if (tasks[key].priority === priority) {
      const taskDeadline = new Date(
        tasks[key].date.split("/").reverse().join("-")
      );
      if (!nextDeadline || taskDeadline < nextDeadline) {
        nextDeadline = taskDeadline;
      }
    }
  }
  return nextDeadline;
}

/**
 * Renders the total count of all tasks.
 * @param {Object} tasks - Collection of all tasks.
 */
function renderAllTasksAmount(tasks) {
  let allTasks = document.getElementById("all-tasks-amount");
  allTasks.innerHTML = /*html*/ `
        ${Object.keys(tasks).length}
    `;
}
