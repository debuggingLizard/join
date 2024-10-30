async function renderSummaryData() {
    let tasks = await getData("tasks");
    console.log(tasks);
    renderTasksAmountByStatus(tasks, "todo");
    renderTasksAmountByStatus(tasks, "done");
    renderUrgentTasksAmount(tasks);
    renderAllTasksAmount(tasks);
    renderTasksAmountByStatus(tasks, "progress");
    renderTasksAmountByStatus(tasks, "await-feedback");

}

function renderTasksAmountByStatus(tasks, status) {
    let statusAmount = document.getElementById(status + "-tasks-amount")
    let amount = 0;
    for (const key in tasks) {
        if (tasks[key].status === status) {
            amount++;
        }
    }
    statusAmount.innerHTML = amount;
}

function renderAllTasksAmount(tasks) {
    let allTasks = document.getElementById('all-tasks-amount');
    allTasks.innerHTML = /*html*/`
        ${Object.keys(tasks).length}
    `
}

async function renderUrgentTasksAmount(tasks) {
    let priorities = await getData("priorities");
    let priority;
    let priorityAmount = document.getElementById("urgent-tasks-amount");
    let nextDeadline = document.getElementById("next-deadline");
    let amount = 0;
    let closestDeadline = null;
    for (const key in priorities) {
        if (priorities[key].title === "Urgent") {
            priority = key;
        }
    }
    console.log(priority);

    for (const key in tasks) {
        if (tasks[key].priority === priority) {
            amount++;
            const taskDeadline = new Date(tasks[key].date.split("/").reverse().join("-"));
            if (!closestDeadline || taskDeadline < closestDeadline) {
                closestDeadline = taskDeadline;
            }
        }
    }
    priorityAmount.innerHTML = amount;
    nextDeadline.innerHTML = closestDeadline.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}

