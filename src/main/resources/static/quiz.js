document.addEventListener('DOMContentLoaded', function() {
    const student = JSON.parse(sessionStorage.getItem('student'));
    if (!student) {
        window.location.href = 'login.html';
        return;
    }

    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-quiz');

    fetch('/api/questions')
        .then(response => response.json())
        .then(questions => {
            questions.forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `
                    <p>${index + 1}. ${question.questionText}</p>
                    ${question.options.map(option => `
                        <label>
                            <input type="radio" name="question-${question.id}" value="${option.id}">
                            ${option.optionText}
                        </label>
                    `).join('')}
                `;
                quizContainer.appendChild(questionElement);
            });
        });

    submitButton.addEventListener('click', function() {
        const answers = [];
        const questionElements = document.querySelectorAll('.question');
        questionElements.forEach(questionElement => {
            const selectedOption = questionElement.querySelector('input:checked');
            if (selectedOption) {
                const questionId = selectedOption.name.split('-')[1];
                const selectedOptionId = selectedOption.value;
                answers.push({
                    student: { id: student.id },
                    questionId: parseInt(questionId),
                    selectedOptionId: parseInt(selectedOptionId)
                });
            }
        });

        fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers),
        })
        .then(response => {
            if (response.ok) {
                quizContainer.innerHTML = '<h2>Thank you for submitting the quiz!</h2>';
                submitButton.style.display = 'none';
            } else {
                alert('There was an error submitting your quiz.');
            }
        });
    });
});
