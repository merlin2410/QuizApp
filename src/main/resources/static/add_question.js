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

    const quizSelect = document.getElementById('quiz-select');
    const addQuestionForm = document.getElementById('add-question-form');
    const successMessage = document.getElementById('success-message');

    function fetchQuizzes() {
        fetch('/api/quizzes')
            .then(response => response.json())
            .then(quizzes => {
                quizzes.forEach(quiz => {
                    const option = document.createElement('option');
                    option.value = quiz.id;
                    option.textContent = quiz.title;
                    quizSelect.appendChild(option);
                });
            });
    }

    addQuestionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const quizId = quizSelect.value;
        const questionText = document.getElementById('questionText').value;
        const figureUrl = document.getElementById('figureUrl').value;
        const marks = document.getElementById('marks').value;
        const timeLimit = document.getElementById('timeLimit').value;

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
            marks: parseInt(marks),
            timeLimit: timeLimit ? parseInt(timeLimit) : null,
            options: options
        };

        fetch(`/api/quizzes/${quizId}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        })
        .then(response => {
            if (response.ok) {
                successMessage.textContent = 'Question added successfully!';
                addQuestionForm.reset();
            } else {
                throw new Error('Failed to add question');
            }
        })
        .catch(error => {
            successMessage.textContent = error.message;
            successMessage.classList.add('error');
        });
    });

    fetchQuizzes();
});
