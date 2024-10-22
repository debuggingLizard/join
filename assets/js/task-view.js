
function openTaskDetail() {
  const overlay = document.getElementById("overlay");
  const taskDetail = document.getElementById("task-detail");
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
  const editTaskConfirmBtn = document.querySelector('.edit-task-confirm-btn');

  editTaskWrapper.style.display = 'none'; 
  editTaskConfirmBtn.style.display = 'none'; 
  taskDetail.style.display = 'block'; 

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
    editTaskConfirmBtn.style.display = 'none'; 
    document.getElementById("overlay").style.display = "none"; 
  }, 300); 
}

function editTask() {
  const taskDetail = document.getElementById("task-detail");
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');
  const editTaskConfirmBtn = document.querySelector('.edit-task-confirm-btn'); 
  
  taskDetail.style.display = 'none'; 
  editTaskWrapper.style.display = 'flex';
  editTaskConfirmBtn.style.display = 'flex'; 
}

function confirmEdit() {
  const taskDetail = document.getElementById("task-detail");
  const editTaskWrapper = document.querySelector('.edit-task-wrapper');

  editTaskWrapper.style.display = 'none'; 
  taskDetail.style.display = 'block'; 
}


