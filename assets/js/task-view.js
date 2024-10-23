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
                      <div class="check-subtask"><img class="checkbox-img" src="./assets/img/Rectangle 5.svg" alt="">
                      <span>${subtask.title}</span></div>`).join('')}
              </div>
          </div>
          <div class="task-edit-delete">
              <button class="task-edit-delete-btn"><img src="./assets/img/delete.svg" alt="">
                  <span>Delete</span>
              </button>
              <button onclick="editTask()" class="task-edit-delete-btn"><img src="./assets/img/edit.svg" alt="">
                  <span>Edit</span>
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
  let taskInformation = await getData('tasks/' + taskId);
  let taskPriority = await getData('priorities/' + taskInformation.priority);
  let taskCategory = await getData('categories/' + taskInformation.category);
  let assignedUsers = await getAssignedUsers(taskInformation.users);
  let subtasks = taskInformation.subtasks || [];

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
  const editTaskConfirmBtn = document.querySelector('.edit-task-confirm-btn');
   
  taskDetail.style.display = 'none'; 
  
  if (editTaskWrapper && editTaskConfirmBtn) {
      editTaskWrapper.style.display = 'flex'; 
      editTaskConfirmBtn.style.display = 'flex'; 
  }
  editTaskWrapper.style.position = 'absolute'; 
  editTaskWrapper.style.top = taskDetail.offsetTop + 'px'; 
}

function confirmEdit() {
  const taskDetail = document.getElementById("task-detail");
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
 
  if (editTaskWrapper) {
      editTaskWrapper.style.display = 'none'; 
  }
  taskDetail.style.display = 'block'; 
}





