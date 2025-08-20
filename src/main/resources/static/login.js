document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const rollNumber = document.getElementById('rollNumber').value;
    const errorMessage = document.getElementById('error-message');

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber: rollNumber }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid Roll Number');
        }
    })
    .then(student => {
        sessionStorage.setItem('student', JSON.stringify(student));
        window.location.href = 'select_quiz.html';
    })
    .catch(error => {
        errorMessage.textContent = error.message;
    });
});
