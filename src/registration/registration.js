document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://563a51ee0f4c6cb1.mokky.dev/register';

    async function onSubmit() {
        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!validateInput(login)) {
            alert(
                'Пожалуйста, введите корректный адрес электронной почты или номер телефона.'
            );
            return; // Предотвращает отправку формы
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password,
                }),
            });
        } catch (error) {
            console.error(error);
        }
        switch (res.status) {
            case 201:
                alert('регистрация прошла успешно');
                break;
            case 401:
                alert('Пользователь уже зарегистрирован');
                break;
            default:
                alert('Ошибка связи');
        }
    }

    document.getElementById('enter').addEventListener('click', onSubmit);
    document.getElementById('aut').addEventListener('click', function () {
        window.location.href = '../auth/auth.html';
    });
});
