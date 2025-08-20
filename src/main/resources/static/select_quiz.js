document.addEventListener('DOMContentLoaded', function() {
    const student = JSON.parse(sessionStorage.getItem('student'));
    if (!student) {
        window.location.href = 'login.html';
        return;
    }

    const quizList = document.getElementById('student-quiz-list');

    fetch('/api/quizzes')
        .then(response => response.json())
        .then(quizzes => {
            if (quizzes.length === 0) {
                quizList.innerHTML = '<li>No quizzes available at the moment.</li>';
                return;
            }
            quizzes.forEach(quiz => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `start_quiz.html?quizId=${quiz.id}`;
                link.textContent = quiz.title;
                listItem.appendChild(link);
                quizList.appendChild(listItem);
            });
        });
});
