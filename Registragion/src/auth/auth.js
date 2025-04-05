document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://563a51ee0f4c6cb1.mokky.dev/auth';
    function validateInput(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        return emailPattern.test(value) || phonePattern.test(value);
    }

    async function onSubmit(event) {
        event.preventDefault();

        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value.trim();

        // if (!validateInput(login) || !validateInput(password)) {
        //     return; // Предотвращает отправку формы
        // }

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
            switch (res.status) {
                case 201:
                    const json = await res.json();
                    alert('Пользователь авторизирован');
                    window.location.href = '../task/task.html';
                    break;
                case 401:
                    alert('Пользователь не зарегистрирован');
                    break;
                case 403:
                    alert('Аутентификация отклонена');
                    break;
                default:
                    alert('провал');
                    break;
            }
        } catch (error) {}
    }

    document.getElementById('enter').addEventListener('click', onSubmit);
    document.getElementById('reg').addEventListener('click', function () {
        window.location.href = '../registration/registration.html';
    });
});
