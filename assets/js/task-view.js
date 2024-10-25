let taskId;
let taskInformation;
let taskPriority;
let taskCategory;
let assignedUsers;
let selectedUserIds = [];
let isFirstOpen = true;
let editFormErrors = {
    title: 0,
    dueDate: 0
};

function createTaskDetailTemplate() {
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
             
                ${(taskInformation.subtasks && taskInformation.subtasks.length > 0) ?
            taskInformation.subtasks.map((subtask, index) => `
                    <div class="check-subtask" id="subtask-${index}" onclick="toggleSubtask(${index})">
                        <img id="unchecked-${index}" class="checkbox-img" src="./assets/img/unchecked-button.svg" alt="checkbox" style="display: ${subtask.done ? 'none' : 'inline-block'};">
                        <img id="checked-${index}" class="checkbox-tick-img" src="./assets/img/checked-button.svg" alt="checkbox" style="display: ${subtask.done ? 'inline-block' : 'none'};">
                        <span>${subtask.title}</span>
                        </div>`).join('')
            : '<p>No subtasks available</p>'}
                    </div>
            </div>
            
            <div class="task-edit-delete">
                <button class="task-edit-delete-btn"><img src="./assets/img/delete.svg" alt="">
                    <span>Delete</span>
                </button>
                <button onclick="openEditTaskForm()" class="task-edit-delete-btn"><img src="./assets/img/edit.svg" alt="">
                    <span>Edit</span>
                </button>
            </div>
        </div>`;
}
function createEditTaskTemplate() {
    return `
    <div class="edit-task" id="edit-task" onclick="event.stopPropagation();">
        <div id="close-btn-edit-task-detail" class="close-btn-edit-task-detail" onclick="closeTaskDetail()">
            <img src="./assets/img/close.svg" alt="Close">
        </div>

        <form id="edit-task-form" class="form-column edit-task-form-column" novalidate>
            <label for="title">
                <div>Title<span class="required">*</span></div>
                <input type="text" id="title" name="title" placeholder="Enter a title" value="${taskInformation.title}" required>
                <span class="title-error error d-none"></span>
            </label>

            <label for="description">
                <div>Description</div>
                <textarea id="description" name="description" rows="4"
                    placeholder="Enter a Description">${taskInformation.description}</textarea>
            </label>

            <label for="due-date" class="date-label">
                <div>Due date<span class="required">*</span></div>
                <input type="text" class="picker text-date" id="due-date" name="due-date" value="${taskInformation.date}" onfocus="clearPlaceholder()"
                    onblur="setPlaceholder()" onchange="formatDate()" required>
                <span class="due-date-error error d-none"></span>
            </label>

            <label>
                <div>Prio</div>
                <div class="prio-options">
                    <div class="prio-btn urgent ${taskPriority.title === 'Urgent' ? 'active' : ''}" onclick="selectPrio('urgent', '-O9M0Iky4rEYMLq5JwoZ')">
                        Urgent<span class="icon-urgent"></span>
                    </div>
                    <div class="prio-btn medium ${taskPriority.title === 'Medium' ? 'active' : ''}"
                        onclick="selectPrio('medium', '-O9M0Iky4rEYMLq5Jwo_')">
                        Medium<span class="icon-medium"></span>
                    </div>
                    <div class="prio-btn low ${taskPriority.title === 'Low' ? 'active' : ''}" onclick="selectPrio('low', '-O9M0IlWMv7MvM-vtcJ-')">
                        Low <span class="icon-low"></span>
                    </div>
                </div>
                <input type="hidden" id="selectedPrio" name="prio" value="${taskInformation.priority}">
            </label>

            <label for="assignees" class="assign-label">
                <div>Assigned to</div>
                <div>
                    <input type="search" name="assignees" id="assignees"
                        placeholder="Select contacts to assign" onclick="toggleContactDropdown()">
                    <div class="assignees-list d-none"></div>
                    <div id="assigned-to" class="assigned-to">
                        ${(assignedUsers).map(user => `
                            <span id="${user.id}" class="contact-profile-image" style="background-color:${user.color}">${user.profileImage}</span>
                        `).join('')}
                    </div>
                </div>
            </label>

            <label for="subtasks">
                <div>Subtasks</div>
                <div class="subtask-row">
                    <input type="text" id="subtasks" name="subtasks" placeholder="Add new subtask">
                    <div class="subtask-buttons">
                        <span class="clear-subtask-btn icon-close" onclick="clearSubtaskInput()"></span>
                        <span class="add-subtask-btn icon-add" onclick="addSubtask()"></span>
                    </div>
                </div>
                <ul id="subtask-list" class="subtask-list">
                    ${(taskInformation.subtasks || []).map((subtask, index) => `
                        <li class="subtask-item">
                            <span ondbclick="editSubtask(this)" class="subtask-title">${subtask.title}</span>
                            <div class="subtask-actions">
                                <div class="edit-subtask-btn icon-edit" onclick="editSubtask(this)"></div>
                                <div class="delete-subtask-btn icon-delete" onclick="deleteSubtask(this)"></div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </label>

            <div class="edit-task-confirm-btn">
                <button id="editTaskBtn" type="submit" class="create-task-btn">
                    Ok<span class="icon-check"></span>
                </button>
            </div>
        </form>                                    
        
    </div>
    `;
}

async function getDataFromDatabase() {
    try {
        taskInformation = await getData('tasks/' + taskId);
        taskPriority = await getData('priorities/' + taskInformation.priority);
        taskCategory = await getData('categories/' + taskInformation.category);
        assignedUsers = await getAssignedUsers();
    } catch (error) {
        console.error("Get data failed:");
    }
}

async function getAssignedUsers() {
    if (taskInformation.users != undefined && taskInformation.users.length > 0) {
        const userDetails = [];
        for (const userId of taskInformation.users) {
            const user = await getData('users/' + userId);
            user['id'] = userId;
            userDetails.push(user);
        }

        return userDetails;
    }

    return [];
}

async function openTaskDetail(id) {
    taskId = id;

    await getDataFromDatabase();

    const taskDetailHTML = createTaskDetailTemplate();
    document.getElementById('overlay').innerHTML = taskDetailHTML;

    const overlay = document.getElementById("overlay");
    const taskDetail = document.getElementById("task-detail");
    overlay.style.display = "flex";
    setTimeout(() => {
        taskDetail.classList.add("show");
    }, 10);
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


async function openEditTaskForm() {
    const taskDetail = document.getElementById("task-detail");
    const editTaskWrapper = document.querySelector('.edit-task-wrapper');

    taskDetail.style.display = 'none';

    const editTaskHTML = createEditTaskTemplate();
    editTaskWrapper.innerHTML = editTaskHTML;

    editTaskWrapper.style.position = 'absolute';
    editTaskWrapper.style.top = taskDetail.offsetTop + 'px';

    editTaskWrapper.style.display = 'flex';

    renderContacts(taskInformation.users);

    editFormEventListener();
}

function editFormEventListener() {
    let formElement = document.getElementById('edit-task-form');

    formElement.addEventListener("submit", async function (e) {
        e.preventDefault();
        checkEditFormValidation('title', 'The title field is required');
        checkEditFormValidation('due-date', 'The Date field is required');

        if (editFormErrors.title === 0 && editFormErrors.dueDate === 0) {
            await confirmEdit();
        }
    });
}

function checkEditFormValidation(inputName, message) {
    let inputElement = document.querySelector(`#edit-task-form *[name = ${inputName}]`);

    if (!inputElement.checkValidity()) {
        showInputValidationError('#edit-task-form', inputName, message)
        editFormErrors[inputName] = 1;
    } else {
        hideInputValidationError('#edit-task-form', inputName)
        editFormErrors[inputName] = 0;
    }

    if (inputElement.value === 'dd/mm/yyyy') {
        showInputValidationError('#edit-task-form', inputName, message)
        editFormErrors[inputName] = 1;
    }
}

async function confirmEdit() {
    await updateTaskData();
    await getDataFromDatabase();

    const taskDetailHTML = createTaskDetailTemplate();
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

    await loadTasksFromDatabase();
    filterTasks = Object.entries(tasks);
    await renderTasks(taskInformation.status + "-tasks", getTasksByStatus(taskInformation.status));
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

async function updateTaskData() {
    try {
        let title = document.querySelector("#edit-task-form *[name = title]").value;
        let description = document.querySelector("#edit-task-form *[name = description]").value || '';

        let assignedSpans = document.querySelector("#edit-task-form .assigned-to").querySelectorAll("span");
        let users = Array.from(assignedSpans).map((span) => span.id);
        let date = document.querySelector("#edit-task-form *[name = due-date]").value;
        let priority = document.querySelector("#edit-task-form *[name = prio]").value;
        let category = taskInformation.category;

        let subtasks = Array.from(document.querySelector("#edit-task-form .subtask-list").children).map((li) => ({
            done: false,
            title: li.querySelector(".subtask-title").textContent,
        }));
        let status = taskInformation.status;

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

        await putData('tasks', taskId, data);
    } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
    }
}




















