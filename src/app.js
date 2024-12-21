document.addEventListener('DOMContentLoaded', () => {
    const tasks = document.getElementById('tasks');
    const newTask = document.getElementById('newTask');
    const addTask = document.getElementById('addTask');
    const deleteTask = document.getElementById('deleteTask');

    addTask.addEventListener('click', () => {
        const li = document.createElement('li');
        li.textContent = newTask.value;
        tasks.appendChild(li);
        newTask.value = '';
    });

    deleteTask.addEventListener('click', () => tasks.lastElementChild.remove());
});
