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

    deleteTask.addEventListener('click', () => {
        if (tasks.lastElementChild) {
            tasks.lastElementChild.remove();
        }
    });

    const axios = require('axios');

    async function makeApiRequest(method, url, data = null) {
        try {
            const response = await axios({
                method: method,
                url: url,
                data: data
            });
            return response.data;
        } catch (error) {
            console.error('Error making API request:', error);
            throw error;
        }
    }

    async function fetchData() {
        const url = 'https://api.example.com/data';
        try {
            const data = await makeApiRequest('GET', url);
            console.log('Data received:', data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    fetchData();

    async function sendData() {
        const url = 'https://api.example.com/data';
        const postData = { key: 'value' };
        try {
            const response = await makeApiRequest('POST', url, postData);
            console.log('Data sent successfully:', response);
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    }

    sendData();

    function validateData(username, password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!username) {
            return 'Username is required';
        }
        if (!passwordRegex.test(password)) {
            return 'Password must be at least 8 characters long and include both letters and numbers';
        }
        return null;
    }

    async function registerUser(username, password) {
        const url = 'https://api.example.com/register'; // Замените на ваш эндпоинт
        try {
            const response = await axios.post(url, { username, password });
            return response.data;
        } catch (error) {
            if (error.response) {
                // Сервер вернул ответ с ошибкой
                console.error('Server error:', error.response.data);
                throw new Error(error.response.data.message || 'Registration failed');
            } else if (error.request) {
                // Запрос был сделан, но ответ не был получен
                console.error('Network error:', error.request);
                throw new Error('Network error');
            } else {
                // Ошибка при настройке запроса
                console.error('Error:', error.message);
                throw new Error('Error setting up the request');
            }
        }
    }

    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        const validationError = validateData(username, password);
        if (validationError) {
            document.getElementById('message').textContent = validationError;
            return;
        }

        try {
            const response = await registerUser(username, password);
            document.getElementById('message').textContent = 'Registration successful!';
        } catch (error) {
            document.getElementById('message').textContent = error.message;
        }
    });
});
