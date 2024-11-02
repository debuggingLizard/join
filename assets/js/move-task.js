function openMoveTaskDropdown(event, taskId) {
    event.stopPropagation();
    document.getElementById('move-task-dropdown-' + taskId).classList.toggle('d-none');
}

async function changeStatus(newStatus, taskId) {
    if (tasks[taskId].status !== newStatus) {
        let currentStatus = tasks[taskId].status; 
        tasks[taskId].status = newStatus;
        renderBoardsByStatus(currentStatus, newStatus);
        await putData("tasks", taskId + "/status", newStatus);
    }
}
