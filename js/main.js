const form = document.querySelector('#form');
const input = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`

    taskList.insertAdjacentHTML('beforeend', taskHTML);
});

checkEmptyList();

form.addEventListener('submit', addTask);

taskList.addEventListener('click', deleteTask);

taskList.addEventListener('click', doneTask);




function addTask(event) {
    event.preventDefault();

    let taskText = input.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask)

    const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

    const taskHTML = `
        <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${newTask.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`

    taskList.insertAdjacentHTML('beforeend', taskHTML);

    form.reset();
    input.focus();

    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(event) {
    let target = event.target

    if(target.dataset.action === 'delete') {
        const parentNode = target.closest('li');

        const id = parentNode.id

        const index = tasks.findIndex(function(task) {
           
            if(task.id == id) {
                return true
            }
        });

        tasks.splice(index, 1)

        parentNode.remove();
    }

    checkEmptyList();
    saveToLocalStorage();
}

function doneTask(event) {
    if(event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('li'); 

        const id = parentNode.id;

        const task = tasks.find(function(task) {
            if(task.id == id) {
                return true
            }
        });
       
        task.done = !task.done;

        const taskTitle = parentNode.querySelector('span');
        taskTitle.classList.toggle('task-title--done');
    }
    saveToLocalStorage();
}

function checkEmptyList() {
    if(tasks.length == 0) {
        const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список справ пустий</div>
        </li>`;
    
        taskList.insertAdjacentHTML('afterbegin', emptyListElement);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}