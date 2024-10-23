
let taskInformation, taskPriority, taskCategory, assignedUsers, subtasks;

function createTaskDetailTemplate(taskInformation, taskPriority, taskCategory, assignedUsers, subtasks) {
  return `
      <div class="task-detail" id="task-detail" onclick="event.stopPropagation();">
          <div id="close-btn-task-detail" class="close-btn-task-detail" onclick="closeTaskDetail()">
              <img src="./assets/img/close.svg" alt="Close">
          </div>
          <div class="userStory" style="background-color:${taskCategory.color}">${taskCategory.title}</div>
          <h1>${taskInformation.title}</h1>
          <p>${taskInformation.description}</p>
          <div class="task-term">
              <div>
                  <p>Due date:</p>
                  <p>Priority:</p>
              </div>
              <div>
                  <p>${taskInformation.date}</p>
                  <div>
                    <span style="margin-right: 8px;">${taskPriority.title}</span>
                    <span class="icon ${taskPriority.icon}" style="color:${taskPriority.color}"></span>
                  </div>
              </div>
          </div>
          <div class="assigned">
              <p>Assigned To:</p>
              <div id="task-overlay-assigned-contacts">
                  ${(assignedUsers || []).map(user => `
                      <div class="contributor-placement">
                          <div class="contributor" style="background-color: ${user.color};">${user.profileImage}</div>
                          <p>${user.name}</p>
                      </div>`).join('')}
              </div>
          </div>
          <div class="subtask">
              <p style="margin-bottom: 10px;">Subtasks</p>
              <div class="subtask-checkbox">
                  ${(subtasks || []).map(subtask => `
                      <div class="check-subtask">
                        <img class="checkbox-img" src="./assets/img/Rectangle 5.svg" alt="">
                        <span>${subtask.title}</span>
                      </div>`).join('')}
              </div>
          </div>
          <div class="task-edit-delete">
              <button class="task-edit-delete-btn">
                  <img src="./assets/img/delete.svg" alt="">
                  <span>Delete</span>
              </button>
              <button onclick="editTask()" class="task-edit-delete-btn">
                  <img src="./assets/img/edit.svg" alt="">
                  <span>Edit</span>
              </button>
          </div>
      </div>`;
}


function createEditTaskTemplate(taskInformation, taskPriority, taskCategory, assignedUsers, subtasks) {
  let formattedDate = taskInformation.date.replace(/\//g, '-');
  return `
      <div class="edit-task" id="edit-task" onclick="event.stopPropagation();">
          <div id="close-btn-edit-task-detail" class="close-btn-edit-task-detail" onclick="closeTaskDetail()">
              <img src="./assets/img/close.svg" alt="Close">
          </div>

          <div class="form-column edit-task-form-column">
              <label for="title">Title</label>
              <input type="text" id="title" name="title" value="${taskInformation.title}" required>
  
              <label for="description">Description</label>
              <textarea id="description" name="description" rows="4" required>${taskInformation.description}</textarea>

              <label for="due-date">Due date</label>
              <input type="date" id="due-date" name="due-date" value="${formattedDate}" required>
          </div>

          <div class="priority-assignment">
              <p>Priority</p>
              <div class="prio-options edit-task-prio-options">
                  <button type="button" class="prio-btn urgent ${taskPriority.title === 'Urgent' ? 'active' : ''}" onclick="selectPrio('urgent')">Urgent</button>
                  <button type="button" class="prio-btn medium ${taskPriority.title === 'Medium' ? 'active' : ''}" onclick="selectPrio('medium')">Medium</button>
                  <button type="button" class="prio-btn low ${taskPriority.title === 'Low' ? 'active' : ''}" onclick="selectPrio('low')">Low</button>
              </div>
          </div>

          <div class="assigned-contributors-to-task">
              <label for="contactsToAssign" class="assigned-label">Assigned to</label>
              <select id="contactsToAssign" name="contact" required>
                  ${assignedUsers.map(user => `<option value="${user.name}" selected>${user.name}</option>`).join('')}
              </select>
          </div>

          <div class="subtask-section">
                <label for="subtasks" class="subtasks-label">Subtasks</label>
                <div class="subtask-row">
                    <input type="text" id="subtasks" name="subtasks" placeholder="Add new subtask">
                    <button type="button" class="edit-subtask-btn">+</button>
                </div>

                <div class="edit-task-subtask-listing-wrapper">
                    ${(subtasks || []).map(subtask => `
                        <div class="edit-task-subtask-listing">
                            <p><span class="subtask-dot"></span>${subtask.title}</p>
                            <div class="edit-task-subtask-listing-icons">
                                <img src="./assets/img/edit.svg" alt="Edit Subtask" title="Edit">
                                <img src="./assets/img/delete.svg" alt="Delete Subtask" title="Delete">
                            </div>
                        </div>`).join('')}
          
          <div class="edit-task-confirm-btn">
               <button type="submit" class="edit-task-btn" onclick="confirmEdit()">Ok<svg width="25" height="24" 
                            viewBox="0 0 25 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                                                                        
                            <g mask="url(#mask0_75592_9963)">
                                <path
                                    d="M9.69474 15.15L18.1697 6.675C18.3697 6.475 18.6072 6.375 18.8822 6.375C19.1572 6.375 19.3947 6.475 19.5947 6.675C19.7947 6.875 19.8947 7.1125 19.8947 7.3875C19.8947 7.6625 19.7947 7.9 19.5947 8.1L10.3947 17.3C10.1947 17.5 9.96141 17.6 9.69474 17.6C9.42807 17.6 9.19474 17.5 8.99474 17.3L4.69474 13C4.49474 12.8 4.3989 12.5625 4.40724 12.2875C4.41557 12.0125 4.51974 11.775 4.71974 11.575C4.91974 11.375 5.15724 11.275 5.43224 11.275C5.70724 11.275 5.94474 11.375 6.14474 11.575L9.69474 15.15Z"
                                    fill="white" />
                            </g>
                            </svg>
                        </button>  
          </div>
      </div>`;
}


async function getAssignedUsers(userIds) {
  const userDetails = await Promise.all(userIds.map(async userId => {
      return await getData('users/' + userId);  
  }));
  return userDetails;
}

async function openTaskDetail(taskId) {
 
  taskInformation = await getData('tasks/' + taskId);
  taskPriority = await getData('priorities/' + taskInformation.priority);
  taskCategory = await getData('categories/' + taskInformation.category);
  assignedUsers = await getAssignedUsers(taskInformation.users);
  subtasks = taskInformation.subtasks || [];

 
  const taskDetailHTML = createTaskDetailTemplate(taskInformation, taskPriority, taskCategory, assignedUsers, subtasks);
  document.getElementById('overlay').innerHTML = taskDetailHTML;

 
  const overlay = document.getElementById("overlay");
  const taskDetail = document.getElementById("task-detail");
  overlay.style.display = "flex"; 
  setTimeout(() => {
      taskDetail.classList.add("show");
  }, 10);

 
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
  const editTaskConfirmBtn = document.querySelector('.edit-task-confirm-btn');
  
 
  if (editTaskWrapper && editTaskConfirmBtn) {
      editTaskWrapper.style.display = 'none'; 
      editTaskConfirmBtn.style.display = 'none';
  }
}


function closeTaskDetail() {
  const taskDetail = document.getElementById("task-detail");
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
  const editTaskConfirmBtn = document.querySelector('.edit-task-confirm-btn');
  
  taskDetail.classList.remove("show");
  setTimeout(() => {
    taskDetail.style.display = 'none'; 
    editTaskWrapper.style.display = 'none'; 
    editTaskConfirmBtn.style.display = 'none'; 
    document.getElementById("overlay").style.display = "none"; 
  }, 300); 
}

function editTask() {
  const taskDetail = document.getElementById("task-detail");
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
  
 
  taskDetail.style.display = 'none'; 

 
  const editTaskHTML = createEditTaskTemplate(taskInformation, taskPriority, taskCategory, assignedUsers, subtasks);
  console.log('Generated Edit Task HTML:', editTaskHTML);  
  editTaskWrapper.innerHTML = editTaskHTML; 

 
  console.log('Edit Task Wrapper Inhalt:', editTaskWrapper.innerHTML);

 
  editTaskWrapper.style.position = 'absolute'; 
  editTaskWrapper.style.top = taskDetail.offsetTop + 'px'; 

 
  editTaskWrapper.style.display = 'flex'; 
}

function confirmEdit() {
 
  const taskTitle = document.getElementById('title').value;
  const taskDescription = document.getElementById('description').value;
  const taskDueDate = document.getElementById('due-date').value;
  const taskPriority = document.querySelector('.prio-btn.active').innerText;

 
  updateTaskData(taskInformation.id, {
      title: taskTitle,
      description: taskDescription,
      date: taskDueDate,
      priority: taskPriority
  });

 
  const taskDetailHTML = createTaskDetailTemplate(taskInformation, taskPriority, taskCategory, assignedUsers, subtasks);
  document.getElementById('overlay').innerHTML = taskDetailHTML;

 
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
  if (editTaskWrapper) {
    editTaskWrapper.style.display = 'none';
  }
  const taskDetail = document.getElementById("task-detail");
  taskDetail.style.display = 'block'; 
  taskDetail.classList.add("show"); 

  taskDetail.style.position = 'absolute'; 
  taskDetail.style.top = '50%';
  taskDetail.style.left = '50%';
  taskDetail.style.transform = 'translate(-50%, -50%)'; 
}

async function updateTaskData(taskId, updatedData) {
  await updateData(`tasks/${taskId}`, updatedData);  
}


