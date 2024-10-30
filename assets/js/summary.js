async function renderSummaryData() {
    let tasks = await getData("tasks");
    console.log(tasks);
    renderTasksAmountByStatus(tasks, "todo");
    renderTasksAmountByStatus(tasks, "done");
    renderUrgentTasks(tasks);
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

async function renderUrgentTasks(tasks) {
    let priority = await getPriorityID();
    let amount = getUrgentTasksAmount(tasks, priority);
    let nextDeadline = getNextUrgentDeadline(tasks, priority);

    document.getElementById("urgent-tasks-amount").innerHTML = amount;
    document.getElementById("next-deadline").innerHTML =
        nextDeadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

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

function getUrgentTasksAmount(tasks, priority) {
    let amount = 0;
    for (const key in tasks) {
        if (tasks[key].priority === priority) {
            amount++;
        }
    }
    return amount;
}

function getNextUrgentDeadline(tasks, priority) {
    let nextDeadline = null;
    for (const key in tasks) {
        if (tasks[key].priority === priority) {
            const taskDeadline = new Date(tasks[key].date.split("/").reverse().join("-"));
            if (!nextDeadline || taskDeadline < nextDeadline) {
                nextDeadline = taskDeadline;
            }
        }
    }
    return nextDeadline;
}


