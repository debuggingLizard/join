/**
 * Generates the HTML template for displaying detailed information about a task.
 * Also provides buttons for editing and deleting of the task.
 *
 * @returns {string} The HTML string template for the task detail view.
 *
 * @description
 * This template includes:
 * - Task category with color-coded background.
 * - Task title, description, due date, and priority with icon.
 * - Assigned users, each with initials and background color.
 * - List of subtasks with checkboxes indicating completion status.
 * - Edit and delete buttons with confirmation for task deletion.
 */
function taskDetailTemplate() {
  return `
              <div class="task-detail-header">
                  <div class="userStory" style="background-color:${
                    taskCategory.color
                  }">${taskCategory.title}</div>
                  <div class="close-btn-task-detail icon icon-close" onclick="closeTaskDetail()"></div>
              </div>
  
              <div class="task-detail-body">
                  <h1>${taskInformation.title}</h1>
                  <p>${taskInformation.description}</p>
                  <div class="task-term">
                      <div>
                          <p>Due date:</p>
                          <p>Priority:</p>
                      </div>
                      <div>
                          <p>${taskInformation.date}</p>
                          <div class="detail-priority-container">
                              <span style="margin-right: 8px;">${
                                taskPriority.title
                              }</span>
                              <span class="icon ${
                                taskPriority.icon
                              }" style="color:${taskPriority.color}"></span>
                          </div>
                      </div>
                  </div>
                  <div class="assigned">
                      <p>Assigned To:</p>
                      <div id="task-overlay-assigned-contacts">
                          ${(assignedUsers || [])
                            .map(
                              (user) => `
                              <div class="contributor-placement">
                                  <div class="contributor" style="background-color: ${user.color};">${user.profileImage}</div>
                                  <p>${user.name}</p>
                              </div>
                          `
                            )
                            .join("")}
                      </div>
                  </div>
                  <div class="subtask">
                      <p style="margin-bottom: 10px;">Subtasks</p>
                      <div class="subtask-checkbox">
                      ${
                        taskInformation.subtasks &&
                        taskInformation.subtasks.length > 0
                          ? taskInformation.subtasks
                              .map(
                                (subtask, index) => `
                              <div class="check-subtask" id="subtask-${index}" onclick="toggleSubtask(${index})">
                                  <img id="unchecked-${index}" class="checkbox-img ${
                                  subtask.done ? "d-none" : ""
                                }" src="./assets/img/unchecked-button.svg" alt="checkbox">
                                  <img id="checked-${index}" class="checkbox-tick-img ${
                                  subtask.done ? "" : "d-none"
                                }" src="./assets/img/checked-button.svg" alt="checkbox">
                                  <span>${subtask.title}</span>
                              </div>
                          `
                              )
                              .join("")
                          : "<p>No subtasks available</p>"
                      }
                          </div>
                  </div>
              </div>
  
              <div class="task-edit-delete" id="task-detail-edit-delete">
                  <div class="task-edit-delete-btn" onclick="showDeleteConfirm()">
                      <div class="icon icon-delete"></div>
                      <span>Delete</span>
                  </div>
                  <div class="task-edit-delete-btn" onclick="openEditTaskForm()">
                      <div class="icon icon-edit"></div>
                      <span>Edit</span>
                  </div>
              </div>
  
              <div class="task-edit-delete confirm-delete d-none" id="task-detail-delete-confirm">
                  <div>
                      Are you sure you want delete this task?
                  </div>
                  <div class="task-edit-delete-btn" onclick="hideDeleteConfirm()">
                      <div class="icon icon-close"></div>
                      <span>No</span>
                  </div>
                  <div class="task-edit-delete-btn" onclick="confirmDelete()">
                      <div class="icon icon-check"></div>
                      <span>Yes</span>
                  </div>
              </div>
              `;
}

/**
 * Generates the HTML template for editing a task, allowing the user to modify
 * the title, description, due date, priority, assignees, and subtasks.
 * Includes validation for required fields and functionality for updating subtasks and assignees.
 *
 * @returns {string} The HTML string template for the task edit view.
 *
 * @description
 * This template includes:
 * - An editable task title with validation.
 * - A description field.
 * - A due date input with placeholder handling and date formatting.
 * - Priority selection buttons, with the currently selected priority highlighted.
 * - An assignees dropdown allowing the selection of contacts.
 * - A subtask input field with clear and add buttons, and a list of existing subtasks.
 * - A confirmation button to submit the edited task details.
 */
function editTaskTemplate() {
  return `
          <div class="edit-task-header">
              <div class="close-btn-task-detail icon icon-close" onclick="closeTaskDetail()"></div>
          </div>
  
          <form id="edit-task-form" novalidate>
              <div class="form-column edit-task-form-column">
                  <label for="title">
                      <div>Title</div>
                      <input type="text" id="title" name="title" placeholder="Enter a title" value="${
                        taskInformation.title
                      }" required>
                      <span class="title-error error d-none"></span>
                  </label>
  
                  <label for="description">
                      <div>Description</div>
                      <textarea id="description" name="description" rows="4"
                          placeholder="Enter a Description">${
                            taskInformation.description
                          }</textarea>
                  </label>
  
                  <label for="due-date" class="date-label">
                      <div>Due date</div>
                      <input type="text" class="picker text-date" id="due-date" name="due-date" value="${
                        taskInformation.date
                      }" onfocus="clearPlaceholder('#edit-task-form')"
                          onblur="setPlaceholder('#edit-task-form')" onchange="formatDate('#edit-task-form')" required>
                      <span class="due-date-error error d-none"></span>
                  </label>
  
                  <label>
                      <div>Priority</div>
                      <div class="prio-options">
                          <div class="prio-btn urgent ${
                            taskPriority.title === "Urgent" ? "active" : ""
                          }" onclick="selectPrio('#edit-task-form', 'urgent', '-O9M0Iky4rEYMLq5JwoZ')">
                              Urgent<span class="icon-urgent"></span>
                          </div>
                          <div class="prio-btn medium ${
                            taskPriority.title === "Medium" ? "active" : ""
                          }"
                              onclick="selectPrio('#edit-task-form', 'medium', '-O9M0Iky4rEYMLq5Jwo_')">
                              Medium<span class="icon-medium"></span>
                          </div>
                          <div class="prio-btn low ${
                            taskPriority.title === "Low" ? "active" : ""
                          }" onclick="selectPrio('#edit-task-form', 'low', '-O9M0IlWMv7MvM-vtcJ-')">
                              Low <span class="icon-low"></span>
                          </div>
                      </div>
                      <input type="hidden" id="selectedPrio" name="prio" value="${
                        taskInformation.priority
                      }">
                  </label>
  
                  <label for="assignees" class="assign-label">
                      <div>Assigned to</div>
                      <div>
                          <input type="search" name="assignees" id="assignees"
                              placeholder="Select contacts to assign" onclick="toggleContactDropdown('#edit-task-form')">
                          <div class="assignees-list d-none"></div>
                          <div id="assigned-to" class="assigned-to">
                              ${assignedUsers
                                .map(
                                  (user) => `
                                  <span id="${user.id}" class="contact-profile-image" style="background-color:${user.color}">${user.profileImage}</span>
                              `
                                )
                                .join("")}
                          </div>
                      </div>
                  </label>
  
                  <label for="subtasks">
                      <div>Subtasks</div>
                      <div class="subtask-row">
                          <input type="text" id="subtasks" name="subtasks" placeholder="Add new subtask">
                          <div class="subtask-buttons">
                              <span class="clear-subtask-btn icon-close" onclick="clearSubtaskInput('#edit-task-form')"></span>
                              <span class="add-subtask-btn icon-add" onclick="addSubtask('#edit-task-form')"></span>
                          </div>
                      </div>
                      <ul id="subtask-list" class="subtask-list">
                          ${(taskInformation.subtasks || [])
                            .map(
                              (subtask, index) => `
                              <li class="subtask-item">
                                  <span class="subtask-dot"></span>
                                  <span ondbclick="editSubtask(this)" class="subtask-title" status="${subtask.done}">${subtask.title}</span>
                                  <div class="subtask-actions">
                                      <div class="edit-subtask-btn icon-edit" onclick="editSubtask(this)"></div>
                                      <div class="delete-subtask-btn icon-delete" onclick="deleteSubtask(this)"></div>
                                  </div>
                              </li>
                          `
                            )
                            .join("")}
                      </ul>
                  </label>
              </div>
              <div class="edit-task-confirm-btn">
                  <button id="editTaskBtn" type="submit" class="create-task-btn">
                      Ok<span class="icon-check"></span>
                  </button>
              </div> 
          </form>                    
      `;
}
