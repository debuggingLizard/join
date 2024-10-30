async function renderSummaryData() {
    setGreeting();
    let tasks = await getData("tasks");
    renderTasksAmountByStatus(tasks, "todo");
    renderTasksAmountByStatus(tasks, "done");
    renderUrgentTasks(tasks);
    renderAllTasksAmount(tasks);
    renderTasksAmountByStatus(tasks, "progress");
    renderTasksAmountByStatus(tasks, "await-feedback");
}

function setGreeting() {
    document.getElementById('greeting').innerText = getGreeting();
}

function getGreeting() {
    let now = new Date();
    let hours = now.getHours();
    let greeting;
    switch (true) {
        case (hours < 12):
            greeting = "Good Morning,";
            break;
        case (hours < 18):
            greeting = "Good Afternoon,";
            break;
        default: 
            greeting = "Good Evening,";
    }
    return greeting; 
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

function renderAllTasksAmount(tasks) {
    let allTasks = document.getElementById('all-tasks-amount');
    allTasks.innerHTML = /*html*/`
        ${Object.keys(tasks).length}
    `
}