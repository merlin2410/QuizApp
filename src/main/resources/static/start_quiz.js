document.addEventListener('DOMContentLoaded', function() {
    const student = JSON.parse(sessionStorage.getItem('student'));
    if (!student) {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');

    if (!quizId) {
        window.location.href = 'select_quiz.html';
        return;
    }

    const quizTitle = document.getElementById('quiz-title');
    const quizDetails = document.getElementById('quiz-details');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    fetch(`/api/quizzes/${quizId}`)
        .then(response => response.json())
        .then(quiz => {
            quizTitle.textContent = quiz.title;
            quizDetails.textContent = `This quiz has ${quiz.questions.length} questions and a time limit of ${quiz.totalTimeLimit} minutes.`;
            startQuizBtn.addEventListener('click', function() {
                window.location.href = `quiz.html?quizId=${quizId}`;
            });
        });
});
