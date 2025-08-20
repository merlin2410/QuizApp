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

    const quizList = document.getElementById('quiz-list');
    const createQuizForm = document.getElementById('create-quiz-form');
    const successMessage = document.getElementById('create-success-message');

    function fetchQuizzes() {
        fetch('/api/quizzes')
            .then(response => response.json())
            .then(quizzes => {
                quizList.innerHTML = '';
                quizzes.forEach(quiz => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${quiz.title} (${quiz.totalTimeLimit} minutes)`;
                    quizList.appendChild(listItem);
                });
            });
    }

    createQuizForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('quizTitle').value;
        const totalTime = document.getElementById('totalTime').value;

        const newQuiz = {
            title: title,
            totalTimeLimit: parseInt(totalTime)
        };

        fetch('/api/quizzes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newQuiz),
        })
        .then(response => {
            if (response.ok) {
                successMessage.textContent = 'Quiz created successfully!';
                createQuizForm.reset();
                fetchQuizzes(); // Refresh the list
            } else {
                throw new Error('Failed to create quiz');
            }
        })
        .catch(error => {
            successMessage.textContent = error.message;
            successMessage.classList.add('error');
        });
    });

    // Initial fetch
    fetchQuizzes();
});
