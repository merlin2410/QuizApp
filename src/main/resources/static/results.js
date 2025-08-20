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

    const quizSelect = document.getElementById('quiz-select-results');
    const resultsBody = document.getElementById('results-body');

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
                // Fetch results for the first quiz by default
                if (quizzes.length > 0) {
                    fetchResults(quizzes[0].id);
                }
            });
    }

    function fetchResults(quizId) {
        fetch(`/api/quizzes/${quizId}/results`)
            .then(response => response.json())
            .then(results => {
                resultsBody.innerHTML = '';
                if (results.length === 0) {
                    resultsBody.innerHTML = '<tr><td colspan="3">No results for this quiz yet.</td></tr>';
                    return;
                }
                results.forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${result.studentName}</td>
                        <td>${result.rollNumber}</td>
                        <td>${result.totalMarks}</td>
                    `;
                    resultsBody.appendChild(row);
                });
            });
    }

    quizSelect.addEventListener('change', function() {
        fetchResults(this.value);
    });

    fetchQuizzes();
});
