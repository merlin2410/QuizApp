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

    const resultsBody = document.getElementById('results-body');

    fetch('/api/results')
        .then(response => response.json())
        .then(submissions => {
            if (submissions.length === 0) {
                resultsBody.innerHTML = '<tr><td colspan="4">No submissions yet.</td></tr>';
                return;
            }
            submissions.forEach(submission => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${submission.student.name}</td>
                    <td>${submission.student.rollNumber}</td>
                    <td>${submission.questionId}</td>
                    <td>${submission.selectedOptionId}</td>
                `;
                resultsBody.appendChild(row);
            });
        });
});
