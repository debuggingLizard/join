
let taskInformation, taskPriority, taskCategory, assignedUsers, subtasks;
let selectedUserIds = []; 
let isFirstOpen = true; 


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
                    <div class="detail-priority-container">
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
             
                ${(subtasks && subtasks.length > 0) ? 
                    subtasks.map((subtask, index) => `
                    <div class="check-subtask" id="subtask-${index}" onclick="toggleSubtask(${index})">
                        <img id="unchecked-${index}" class="checkbox-img" src="./assets/img/unchecked-button.svg" alt="checkbox" style="display: ${subtask.done ? 'none' : 'inline-block'};">
                        <img id="checked-${index}" class="checkbox-tick-img" src="./assets/img/checked-button.svg" alt="checkbox" style="display: ${subtask.done ? 'inline-block' : 'none'};">
                        <span>${subtask.title}</span>
                        </div>`).join('') 
                :       '<p>No subtasks available</p>'}
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
function createEditTaskTemplate(taskInformation, taskPriority, taskCategory, allUsers, assignedUsers, subtasks) {
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
                   
                    <button type="button" class="prio-btn urgent ${taskPriority.title === 'Urgent' ? 'active' : ''}" 
                        onclick="selectPrio('urgent')" 
                        style="background-color: ${taskPriority.title === 'Urgent' ? taskPriority.color : 'transparent'};" 
                        data-color="#FF3B30">
                        <span style="color: ${taskPriority.title === 'Urgent' ? 'white' : 'black'};">Urgent</span>
                        <span class="icon icon-urgent" style="color: ${taskPriority.title === 'Urgent' ? 'white' : '#FF3B30'};"></span> 
                    </button>

                   
                    <button type="button" class="prio-btn medium ${taskPriority.title === 'Medium' ? 'active' : ''}" 
                        onclick="selectPrio('medium')" 
                        style="background-color: ${taskPriority.title === 'Medium' ? taskPriority.color : 'transparent'};" 
                        data-color="#FFB800">
                        <span style="color: ${taskPriority.title === 'Medium' ? 'white' : 'black'};">Medium</span>
                        <span class="icon icon-medium" style="color: ${taskPriority.title === 'Medium' ? 'white' : '#FFB800'};"></span>
                    </button>

                   
                    <button type="button" class="prio-btn low ${taskPriority.title === 'Low' ? 'active' : ''}" 
                        onclick="selectPrio('low')" 
                        style="background-color: ${taskPriority.title === 'Low' ? taskPriority.color : 'transparent'};" 
                        data-color="#34C759">
                        <span style="color: ${taskPriority.title === 'Low' ? 'white' : 'black'};">Low</span>
                        <span class="icon icon-low" style="color: ${taskPriority.title === 'Low' ? 'white' : '#34C759'};"></span>
                    </button>
                    </div>
            </div>

   
            <div class="assigned-contributors-to-task">
                    <label for="contactsToAssign" class="assigned-label">Assigned to</label>
    
                
    <div class="custom-dropdown" onclick="toggleDropdown()">
        <input type="text" id="dropdown-placeholder" placeholder="Select contacts to assign" readonly />
        <div class="dropdown-list" id="contactsDropdown" style="display: none;">
            ${allUsers.map(user => `
                <div class="dropdown-item" onclick="toggleUserSelection('${user.id}')">
                    <div class="contributor" style="background-color: ${user.color};">${user.profileImage}</div>
                    <p>${user.name}</p>
                    <input type="checkbox" id="checkbox-${user.id}" style="display: none;">
                </div>
            `).join('')}
        </div>
    </div>

    <div class="edit-assigned-contributors" id="selectedContributors">
        ${(assignedUsers || []).map(user => `
            <div class="contributor" style="background-color: ${user.color}; display: inline-block; margin-right: 8px;">
                ${user.profileImage}
            </div>
        `).join('')}
   
            <div class="subtask-section">
                    <label for="subtasks" class="subtasks-label">Subtasks</label>
                    <div class="edit-task-subtask-row">
                                        <input type="text" id="subtasks" name="subtasks" placeholder="Add new subtask">
                                        <button type="button" class="edit-subtask-btn">+</button>
                <div class="edit-task-subtask-listing-wrapper">
               
                         ${(subtasks || []).map((subtask, index) => `
                    <div class="edit-task-subtask-listing" id="subtask-${index}">
                     
                    <p id="subtask-text-${index}" class="subtask-text"><span class="subtask-dot"></span>${subtask.title}</p>
                    <input type="text" id="edit-subtask-input-${index}" class="edit-subtask-input" value="${subtask.title}" style="display: none;">

                    <div class="edit-task-subtask-listing-icons" id="icons-${index}">
                        <img src="./assets/img/edit.svg" alt="Edit Subtask" title="Edit" onclick="editSubtask(${index})">
                        <img src="./assets/img/delete.svg" alt="Delete Subtask" title="Delete" onclick="deleteSubtask(${index})">
                    </div>

                    <div class="edit-task-subtask-save-icons" id="save-icons-${index}" style="display: none;">
                        <img src="./assets/img/delete.svg" alt="Delete Subtask" title="Delete" onclick="deleteSubtask(${index})">
                        <img src="./assets/img/check-black.svg" alt="Save Subtask" title="Save" onclick="saveSubtask(${index})" style="width: 20px; height: 20px;">
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    
    
        </div>
        <div class="edit-task-confirm-btn" onclick="event.stopPropagation(); confirmEdit();">
        <button type="submit" class="edit-task-btn" onclick="confirmEdit()">Ok
            <svg width="25" height="24" viewBox="0 0 25 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <g mask="url(#mask0_75592_9963)">
                    <path d="M9.69474 15.15L18.1697 6.675C18.3697 6.475 18.6072 6.375 18.8822 6.375C19.1572 6.375 19.3947 6.475 19.5947 6.675C19.7947 6.875 19.8947 7.1125 19.8947 7.3875C19.8947 7.6625 19.7947 7.9 19.5947 8.1L10.3947 17.3C10.1947 17.5 9.96141 17.6 9.69474 17.6C9.42807 17.6 9.19474 17.5 8.99474 17.3L4.69474 13C4.49474 12.8 4.3989 12.5625 4.40724 12.2875C4.41557 12.0125 4.51974 11.775 4.71974 11.575C4.91974 11.375 5.15724 11.275 5.43224 11.275C5.70724 11.275 5.94474 11.375 6.14474 11.575L9.69474 15.15Z" fill="white"/>
                </g>
            </svg>
        </button>
            </div>
    `;
}




function toggleDropdown() {
    const dropdownList = document.querySelector('.dropdown-list');
    dropdownList.style.display = dropdownList.style.display === 'none' ? 'block' : 'none';
}

async function renderDropdown(users) {
    const dropdownList = document.querySelector('.dropdown-list');
    
    dropdownList.innerHTML = users.map(user => `
        <div class="dropdown-item" onclick="toggleUserSelection('${user.id}')">
            <div class="contributor" style="background-color: ${user.color};">${user.profileImage}</div>
            <span>${user.name}</span>
        </div>
    `).join('');
}

function toggleUserSelection(userId) {
    if (selectedUserIds.includes(userId)) {
        selectedUserIds = selectedUserIds.filter(id => id !== userId);
    } else {
        selectedUserIds.push(userId);
    }
    console.log("Selected Users:", selectedUserIds);
}

async function fetchAndRenderUsers() {
    const users = await getAllUsers(); // Holt die Benutzerliste aus der Datenbank
    renderDropdown(users);
}

// Aufrufen der Funktion, um das Dropdown mit Benutzern zu füllen
fetchAndRenderUsers();


async function getAllUsers() {
    try {
        const users = await getData('users');
        if (!users) throw new Error("Keine Benutzer gefunden");
        
        
        return Object.entries(users).map(([id, user]) => ({
            id, 
            name: user.name || "Unbekannt",
            profileImage: user.profileImage || "N/A",
            color: user.color || "#ccc"
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der User-Daten:", error);
        return []; 
    }
}

async function getAssignedUsers(userIds) {
    if (!Array.isArray(userIds)) {
        console.error("userIds ist keine Array", userIds);
        return [];
    }

    const userDetails = await Promise.all(userIds.map(async userId => {
        try {
            const user = await getData('users/' + userId);
            return user || {};
        } catch (error) {
            console.error("Fehler beim Abrufen des Benutzers:", error);
            return {};
        }
    }));

    return userDetails;
}


async function openTaskDetail(taskId) {
    try {
        taskInformation = await getData('tasks/' + taskId);

        taskPriority = await getData('priorities/' + taskInformation.priority);

        taskCategory = await getData('categories/' + taskInformation.category);

        assignedUsers = await getAssignedUsers(taskInformation.users);

        subtasks = taskInformation.subtasks || [];
        
        if (subtasks.length > 0) {
            const subtasksArray = Array.isArray(subtasks) ? subtasks : Object.values(subtasks);
            const taskDetailHTML = createTaskDetailTemplate(taskInformation, taskPriority, taskCategory, assignedUsers, subtasksArray);
            document.getElementById('overlay').innerHTML = taskDetailHTML;
        } else {
            document.getElementById('overlay').innerHTML = '<p>No subtasks available</p>';
        }

        const overlay = document.getElementById("overlay");
        const taskDetail = document.getElementById("task-detail");
        overlay.style.display = "flex";
        setTimeout(() => {
            taskDetail.classList.add("show");
        }, 10);
    } catch (error) {
        console.error("Fehler beim Öffnen des Task-Details:", error);
    }
}

function closeTaskDetail() {
    const taskDetail = document.getElementById("task-detail");
    taskDetail.classList.remove("show");
    setTimeout(() => {
        taskDetail.style.display = 'none';
        document.getElementById("overlay").style.display = "none";
    }, 300);
}

function closeTaskDetail() {
    const taskDetail = document.getElementById("task-detail");
    const editTaskWrapper = document.querySelector('.edit-task-wrapper');
    const editTaskConfirmBtn = document.querySelector('.edit-task-confirm-btn');
    
    taskDetail.classList.remove("show");
    setTimeout(() => {
      taskDetail.style.display = 'none'; 
      editTaskWrapper.style.display = 'none'; 
      if (editTaskConfirmBtn) {
          editTaskConfirmBtn.style.display = 'none'; 
      }
      document.getElementById("overlay").style.display = "none"; 
    }, 300);
  }
  

async function editTask() {
    const allUsers = await getAllUsers(); 
    const taskDetail = document.getElementById("task-detail");
    const editTaskWrapper = document.querySelector('.edit-task-wrapper');

    
    taskDetail.style.display = 'none';

    
    const editTaskHTML = createEditTaskTemplate(taskInformation, taskPriority, taskCategory, allUsers, assignedUsers, subtasks);
    console.log('Generated Edit Task HTML:', editTaskHTML);
    editTaskWrapper.innerHTML = editTaskHTML; 

    
    console.log('Edit Task Wrapper Inhalt:', editTaskWrapper.innerHTML);

   
    editTaskWrapper.style.position = 'absolute';
    editTaskWrapper.style.top = taskDetail.offsetTop + 'px';

    
    editTaskWrapper.style.display = 'flex';
}


function confirmEdit() {
    const taskTitleElement = document.getElementById('title');
    const taskDescriptionElement = document.getElementById('description');
    const taskDueDateElement = document.getElementById('due-date');
    const taskPriorityElement = document.querySelector('.prio-btn.active');
  
    
    console.log("Title Element:", taskTitleElement);
    console.log("Description Element:", taskDescriptionElement);
    console.log("Due Date Element:", taskDueDateElement);
    console.log("Priority Element:", taskPriorityElement);
  
    if (!taskTitleElement || !taskDescriptionElement || !taskDueDateElement || !taskPriorityElement) {
      console.error("Ein erforderliches Element wurde nicht gefunden.");
      return;
    }
  
    const taskTitle = taskTitleElement.value;
    const taskDescription = taskDescriptionElement.value;
    const taskDueDate = taskDueDateElement.value;
    const taskPriority = taskPriorityElement.innerText;
  
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
      editTaskWrapper.innerHTML = '';  
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
  

  function toggleSubtask(index) {
    const unchecked = document.getElementById(`unchecked-${index}`);
    const checked = document.getElementById(`checked-${index}`);

    if (unchecked.style.display === 'none') {
        unchecked.style.display = 'inline-block';
        checked.style.display = 'none';
    } else {
        unchecked.style.display = 'none';
        checked.style.display = 'inline-block';
    }
}

function editSubtask(index) {
    
    document.getElementById(`edit-subtask-input-${index}`).style.display = 'block';
    document.getElementById(`subtask-text-${index}`).style.display = 'none';
    document.getElementById(`icons-${index}`).style.display = 'none';
    document.getElementById(`save-icons-${index}`).style.display = 'flex';
}

function saveSubtask(index) {
    const newSubtaskText = document.getElementById(`edit-subtask-input-${index}`).value;

   
    document.getElementById(`subtask-text-${index}`).innerText = newSubtaskText;

    
    document.getElementById(`edit-subtask-input-${index}`).style.display = 'none';
    document.getElementById(`subtask-text-${index}`).style.display = 'block';
    document.getElementById(`icons-${index}`).style.display = 'flex';
    document.getElementById(`save-icons-${index}`).style.display = 'none';
}

function selectPrio(priority) {
    document.querySelectorAll('.prio-btn').forEach(btn => {
        const priorityColor = btn.getAttribute('data-color'); 

        
        btn.classList.remove('active');
        btn.style.backgroundColor = 'transparent'; 
        btn.querySelector('span').style.color = 'black'; 
        btn.querySelector('.icon').style.color = priorityColor; 
    });

    
    const selectedBtn = document.querySelector(`.prio-btn.${priority}`);
    selectedBtn.classList.add('active');
    selectedBtn.style.backgroundColor = selectedBtn.getAttribute('data-color'); 
    selectedBtn.querySelector('span').style.color = 'white'; 
    selectedBtn.querySelector('.icon').style.color = 'white'; 
}

async function updateTaskData(taskId, updatedData) {
    try {
        await updateData(`tasks/${taskId}`, updatedData);  
        console.log(`Task ${taskId} updated successfully.`);
    } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
    }
}




















