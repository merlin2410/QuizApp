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

    document.getElementById('add-question-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const questionText = document.getElementById('questionText').value;
        const figureUrl = document.getElementById('figureUrl').value;
        const successMessage = document.getElementById('success-message');

        const options = [];
        const optionElements = document.querySelectorAll('.option');
        const correctOptionIndex = document.querySelector('input[name="isCorrect"]:checked').value;

        optionElements.forEach((optionElement, index) => {
            const optionText = optionElement.querySelector('textarea').value;
            options.push({
                optionText: optionText,
                isCorrect: index == correctOptionIndex
            });
        });

        const question = {
            questionText: questionText,
            figureUrl: figureUrl,
            options: options
        };

        fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        })
        .then(response => {
            if (response.ok) {
                successMessage.textContent = 'Question added successfully!';
                document.getElementById('add-question-form').reset();
            } else {
                throw new Error('Failed to add question');
            }
        })
        .catch(error => {
            successMessage.textContent = error.message;
            successMessage.classList.add('error');
        });
    });
});
