document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://563a51ee0f4c6cb1.mokky.dev/auth';
    function validateInput(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        return emailPattern.test(value) || phonePattern.test(value);
    }

    async function onSubmit() {
        const log = document.getElementById('login').value;

        if (!validateInput(log)) {
            alert(
                'Пожалуйста, введите корректный адрес электронной почты или номер телефона.'
            );
            return; // Предотвращает отправку формы
        }

        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value.trim();
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password,
                }),
            });
            console.log(res.status);
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
        console.log(res.status);
        if (res.status === 201) {
            const json = await res.json();
            console.log(json);

            alert('Пользователь авторизирован');
            window.location.href = '../task/task.html';
        } else if (res.status === 401) {
            alert('Пользователь не найден');
        } else if (res.status === 403) {
            alert('Аутентификация отклонена');
        } else {
            alert('провал');
        }
    }

    document.getElementById('enter').addEventListener('click', onSubmit);
    document.getElementById('reg').addEventListener('click', function () {
        window.location.href = '../registration/registration.html';
    });
});
