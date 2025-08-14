document.getElementById('teacher-login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    fetch('/api/teacher/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid username or password');
        }
    })
    .then(teacher => {
        sessionStorage.setItem('teacher', JSON.stringify(teacher));
        window.location.href = 'admin.html';
    })
    .catch(error => {
        errorMessage.textContent = error.message;
    });
});
