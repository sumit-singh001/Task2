const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');


document.addEventListener('DOMContentLoaded', loadTasks);
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    if (tasks.length === 0) {
        showEmptyState();
        return;
    }
    
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed, task.id);
    });
}


function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    
    saveTask(task);
    
    
    createTaskElement(task.text, task.completed, task.id);
    
    
    taskInput.value = '';
    taskInput.focus();
    
    
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
}


function createTaskElement(text, completed, id) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = id;
    
    if (completed) {
        li.classList.add('completed');
    }
    
    li.innerHTML = `
        <button class="complete-btn">${completed ? '✓' : '○'}</button>
        <span class="task-text">${text}</span>
        <div class="task-actions">
            <button class="delete-btn">✕</button>
        </div>
    `;
    
    
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', toggleComplete);
    deleteBtn.addEventListener('click', deleteTask);
    
    taskList.appendChild(li);
}


function toggleComplete(e) {
    const li = e.target.closest('.task-item');
    const id = li.dataset.id;
    
    
    li.classList.toggle('completed');
    
    
    const completeBtn = li.querySelector('.complete-btn');
    completeBtn.textContent = li.classList.contains('completed') ? '✓' : '○';
    
    
    updateTaskInStorage(id, 'completed', li.classList.contains('completed'));
}


function deleteTask(e) {
    const li = e.target.closest('.task-item');
    const id = li.dataset.id;
    
    
    li.remove();
    
    
    removeTaskFromStorage(id);
    
   
    if (taskList.children.length === 0) {
        showEmptyState();
    }
}


function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function updateTaskInStorage(id, property, value) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id == id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex][property] = value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}


function removeTaskFromStorage(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function showEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <h3>No tasks yet</h3>
        <p>Add a task above to get started!</p>
    `;
    taskList.appendChild(emptyState);
}