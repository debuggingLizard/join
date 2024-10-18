

function openTaskDetail() {
    const overlay = document.getElementById('overlay');
    const taskDetail = document.getElementById('task-detail');
    overlay.style.display = 'flex'; 
    setTimeout(() => {
        taskDetail.classList.add('show'); 
    }, 10); 
}

function closeTaskDetail() {
    const taskDetail = document.getElementById('task-detail');
    taskDetail.classList.remove('show'); 
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'none'; 
    }, 300); 
}
document.getElementById('overlay').addEventListener('click', function() {
    closeTaskDetail(); 
});
document.getElementById('close-btn-task-detail').addEventListener('click', function(event) {
    event.stopPropagation();
    closeTaskDetail(); 
});
window.onload = function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('task-detail').classList.remove('show'); 
};


  
  