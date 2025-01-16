document.addEventListener('DOMContentLoaded', function() {
    
    async function onSubmit() {
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;   
        const res = await fetch("https://563a51ee0f4c6cb1.mokky.dev/register", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            login: login,
            password: password
          })
        });
        console.log(res.status);
        if (res.status === 201) {
          const json = await res.json();
          console.log(json);

          alert ('регистрация прошла успешно')
        }
        else if (res.status === 401) {
            alert ('Пользователь уже зарегистрирован')
        } else {          
            alert ('Ошибка связи')
        }
      
    }

    document.getElementById('enter').addEventListener('click', onSubmit);
});