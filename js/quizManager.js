// quizManager.js
let currentQuestion = {};
let score = 0;
let selectedDomain = '';
let selectedTheme = '';
let filteredQuestions = [];
let currentQuestionNumber = 0;
let selectedAnswers = new Set();
const validatedQuestions = new Set();
const MAX_QUESTIONS = 10;

function startQuiz() {
    selectedTheme = document.getElementById('theme-select').value;
    if (!selectedDomain || !selectedTheme) {
        alert("Veuillez sélectionner un domaine et un thème !");
        return;
    }

    score = 0;
    currentQuestionNumber = 0;
    selectedAnswers.clear();
    validatedQuestions.clear();

    filteredQuestions = questionsData
        .filter(q => q.Domaines === selectedDomain && q["Thèmes"] === selectedTheme)
        .sort(() => 0.5 - Math.random())
        .slice(0, MAX_QUESTIONS);

    if (filteredQuestions.length === 0) {
        alert("Aucune question disponible pour cette combinaison.");
        return;
    }

    document.getElementById('config').classList.add('hidden');
    document.getElementById('quiz-interface').classList.remove('hidden');
    updateScoreDisplay();
    loadNextQuestion();
}

function loadNextQuestion() {
    selectedAnswers.clear();
    if (currentQuestionNumber >= filteredQuestions.length) {
        showFinalResults();
        return;
    }
    currentQuestion = filteredQuestions[currentQuestionNumber];
    currentQuestionNumber++;
    displayQuestion();
    updateProgressBar();
}

function checkAnswer() {
    if (validatedQuestions.has(currentQuestionNumber)) {
        alert("Vous avez déjà validé cette question !");
        return;
    }

    validatedQuestions.add(currentQuestionNumber);
    document.querySelector('.btn-primary').disabled = true;

    const correctAnswers = currentQuestion["Bonne réponse"].split(',').map(a => a.trim());
    const points = parseInt(currentQuestion["Niveau de question"]);
    const isCorrect = correctAnswers.length === selectedAnswers.size &&
        correctAnswers.every(a => selectedAnswers.has(a));

    if (isCorrect) {
        score += points;
        updateScoreDisplay();
    }

    showFeedback(isCorrect, correctAnswers, points);
}
