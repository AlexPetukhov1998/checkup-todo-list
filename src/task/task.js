document.addEventListener('DOMContentLoaded', function () {
    const TaskList = document.getElementById('tasks');

    function createTask() {
        console.log('В функции');

        const task = document.createElement('li');

        const taskText = document.getElementById('NewTask').value;
        if (taskText.trim() === '') {
            alert('Пожалуйста, введите задачу.');
            return;
        }

        const input = document.createElement('input');
        input.value = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function () {
            TaskList.removeChild(task);
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Выполнено';
        editButton.addEventListener('click', function () {
            input.style.textDecoration = 'line-through'; // Зачеркиваем текст
            task.style.backgroundColor = 'lightgreen'; // Изменяем фон на зеленый
        });

        task.appendChild(input);
        task.appendChild(editButton);
        task.appendChild(deleteButton);
        TaskList.appendChild(task);

        document.getElementById('NewTask').value = '';
    }

    document.getElementById('addTask').addEventListener('click', createTask);
});
