document.addEventListener('DOMContentLoaded', function() {
    const teacher = JSON.parse(sessionStorage.getItem('teacher'));
    if (!teacher) {
        window.location.href = 'teacher_login.html';
        return;
    }

    document.getElementById('logout-link').addEventListener('click', function(event) {
        event.preventDefault();
        sessionStorage.removeItem('teacher');
        window.location.href = 'teacher_login.html';
    });

    document.getElementById('add-student-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
    const rollNumber = document.getElementById('rollNumber').value;
    const successMessage = document.getElementById('success-message');

    fetch('/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, rollNumber: rollNumber }),
    })
    .then(response => {
        if (response.ok) {
            successMessage.textContent = 'Student added successfully!';
            document.getElementById('add-student-form').reset();
        } else {
            throw new Error('Failed to add student');
        }
    })
    .catch(error => {
        successMessage.textContent = error.message;
        successMessage.classList.add('error');
    });
    });
});
