let currentDraggable = null;
let currentDraggingElementId;
let offsetX = 0;
let offsetY = 0;
let width = 0;
let height = 0;
let elementAdded = false;
let addedElement = null;
let isOverDropTarget = false;

function dragstart(e, taskId) {
    currentDraggingElementId = taskId;

    e.dataTransfer.setData('text/plain', null);

    currentDraggable = e.target;

    // Get the width and height of the element
    width = currentDraggable.offsetWidth;
    height = currentDraggable.offsetHeight;

    // Set the width and height to the element when drag starts
    currentDraggable.style.width = `${width}px`;
    currentDraggable.style.height = `${height}px`;

    offsetX = e.clientX - currentDraggable.getBoundingClientRect().left; // Calculate the offset
    offsetY = e.clientY - currentDraggable.getBoundingClientRect().top;

    // Prevent the default drag ghost
    e.dataTransfer.setDragImage(new Image(), 0, 0);
}

function drag(e) {
    currentDraggable.classList.add('dragging');
    currentDraggable.style.top = `${e.clientY + window.scrollY - offsetY}px`; // Adjust for scrolling
    currentDraggable.style.left = `${e.clientX + window.scrollX - offsetX}px`; // Adjust for scrolling
    currentDraggable.style.pointerEvents = 'none'; 
}

function dragEnd() {
    currentDraggable.classList.remove('dragging');
    currentDraggable.style.width = '';
    currentDraggable.style.height = '';
    currentDraggable.style.left = '';
    currentDraggable.style.top = '';
    currentDraggable = null;
    elementAdded = false;
}

async function drop(e, targetStatus) {
    e.preventDefault();

    let currentStatus = tasks[currentDraggingElementId].status;

    tasks[currentDraggingElementId].status = targetStatus;
    renderBoardsByStatus(currentStatus, targetStatus);

    await putData("tasks", currentDraggingElementId + '/status', targetStatus);
}

function loadDropTargets(){
    const dropTargets = document.querySelectorAll('.drop-target');

    dropTargets.forEach(target => {
    
        target.addEventListener('dragover', (e) => {
            e.preventDefault();
        
            if (!elementAdded) {
                const newElement = document.createElement('div');
                newElement.classList.add('dragging-target-area');
                newElement.style.width = `${width}px`;
                newElement.style.height = `${height}px`;
        
                target.appendChild(newElement);
                elementAdded = true;
                addedElement = newElement;
            }
        });
    
        target.addEventListener('dragenter', () => {
            isOverDropTarget = true;
        });
    
        target.addEventListener('dragleave', (e) => {
            if (isOverDropTarget && !target.contains(e.relatedTarget)) {
                if (addedElement) {
                    target.removeChild(addedElement);
                    elementAdded = false;
                    addedElement = null;
                }
                isOverDropTarget = false;
            }
        });
    });
}