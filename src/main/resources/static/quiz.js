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

    let questions = [];
    let userAnswers = [];
    let currentQuestionIndex = 0;
    let timerInterval;

    const quizTitleEl = document.getElementById('quiz-title-main');
    const timerEl = document.getElementById('timer');
    const questionContainer = document.getElementById('question-container');
    const questionNavContainer = document.getElementById('question-nav-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    function startTimer(duration) {
        let timer = duration * 60;
        timerInterval = setInterval(function() {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerEl.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (--timer < 0) {
                clearInterval(timerInterval);
                submitQuiz();
            }
        }, 1000);
    }

    function renderQuestion(index) {
        const question = questions[index];
        questionContainer.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.questionText}</p>
            ${question.figureUrl ? `<img src="${question.figureUrl}" alt="Question Figure" style="max-width: 100%;">` : ''}
            <div class="options">
                ${question.options.map(option => `
                    <label>
                        <input type="radio" name="question-${question.id}" value="${option.id}">
                        ${option.optionText}
                    </label>
                `).join('')}
            </div>
        `;
        MathJax.typeset(); // Re-render LaTeX
        // Restore saved answer
        const savedAnswer = userAnswers.find(ans => ans.questionId === question.id);
        if (savedAnswer) {
            document.querySelector(`input[value="${savedAnswer.selectedOptionId}"]`).checked = true;
        }
    }

    function renderQuestionNav() {
        questionNavContainer.innerHTML = '';
        questions.forEach((q, i) => {
            const navLink = document.createElement('a');
            navLink.href = '#';
            navLink.textContent = i + 1;
            navLink.classList.add('question-nav-link');
            if (i === currentQuestionIndex) {
                navLink.classList.add('active');
            }
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                saveAnswer();
                currentQuestionIndex = i;
                renderQuestion(i);
                updateNavButtons();
            });
            questionNavContainer.appendChild(navLink);
        });
    }

    function saveAnswer() {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedOption = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`);
        if (selectedOption) {
            const existingAnswerIndex = userAnswers.findIndex(ans => ans.questionId === currentQuestion.id);
            const answer = {
                student: { id: student.id },
                quiz: { id: quizId },
                questionId: currentQuestion.id,
                selectedOptionId: parseInt(selectedOption.value)
            };
            if (existingAnswerIndex > -1) {
                userAnswers[existingAnswerIndex] = answer;
            } else {
                userAnswers.push(answer);
            }
        }
    }

    function updateNavButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === questions.length - 1;
    }

    function submitQuiz() {
        saveAnswer();
        clearInterval(timerInterval);
        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userAnswers)
        }).then(response => {
            if (response.ok) {
                window.location.href = 'select_quiz.html'; // Or a dedicated results page
            } else {
                alert('Error submitting quiz.');
            }
        });
    }

    fetch(`/api/quizzes/${quizId}`)
        .then(response => response.json())
        .then(quiz => {
            questions = quiz.questions;
            quizTitleEl.textContent = quiz.title;
            startTimer(quiz.totalTimeLimit);
            renderQuestion(0);
            renderQuestionNav();
            updateNavButtons();
        });

    prevBtn.addEventListener('click', () => {
        saveAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(currentQuestionIndex);
            updateNavButtons();
        }
    });

    nextBtn.addEventListener('click', () => {
        saveAnswer();
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
            updateNavButtons();
        }
    });

    submitBtn.addEventListener('click', submitQuiz);
});
