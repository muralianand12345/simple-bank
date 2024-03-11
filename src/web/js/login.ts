async function login() {
    let usernameElement = document.getElementById('username') as HTMLInputElement
    let username = usernameElement.value

    let passwordElement = document.getElementById('password') as HTMLInputElement
    let password = passwordElement.value

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": username, "password": password })
        });

        const data = await response.json();

        if (response.ok) {
            document.cookie = `sessionAuth=${data.sessionAuth};`;
            window.location.href = '/';
        } else {
            alert(data.message);
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error handling login:', error);
    }

}