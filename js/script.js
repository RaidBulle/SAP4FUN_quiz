// Variables globales
let questionsData = [];
let currentQuestion = {};
let score = 0;
let selectedDomain = '';
let selectedTheme = '';
let filteredQuestions = [];
let currentQuestionNumber = 0;
const MAX_QUESTIONS = 10;

// Charger les questions
function loadQuestions() {
    fetch('data/questions.json')
        .then(response => {
            if (!response.ok) throw new Error('Erreur de réseau');
            return response.json();
        })
        .then(data => {
            console.log("Questions chargées:", data);
            questionsData = data;
            initDomaines();
        })
        .catch(error => {
            console.error("Erreur lors du chargement des questions:", error);
            alert("Erreur lors du chargement des questions. Veuillez recharger la page.");
        });
}

// Initialiser les domaines
function initDomaines() {
    const domaineSelect = document.getElementById('domaine-select');
    domaineSelect.innerHTML = '<option value="">Sélectionnez un domaine</option>';
    const domaines = [...new Set(questionsData.map(q => q.Domaines))];
    domaines.forEach(domaine => {
        const option = document.createElement('option');
        option.value = domaine;
        option.textContent = domaine;
        domaineSelect.appendChild(option);
    });
    domaineSelect.addEventListener('change', function () {
        selectedDomain = this.value;
        updateThemes();
    });
}

// Mettre à jour les thèmes
function updateThemes() {
    const themeSelect = document.getElementById('theme-select');
    themeSelect.innerHTML = '<option value="">Sélectionnez un thème</option>';
    if (!selectedDomain) return;
    const themes = [...new Set(
        questionsData
            .filter(q => q.Domaines === selectedDomain)
            .map(q => q["Thèmes"])
    )];
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeSelect.appendChild(option);
    });
}

// Démarrer le quiz
function startQuiz() {
    selectedTheme = document.getElementById('theme-select').value;
    if (!selectedDomain || !selectedTheme) {
        alert("Veuillez sélectionner un domaine et un thème !");
        return;
    }
    score = 0;
    currentQuestionNumber = 0;
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

// Charger la question suivante
function loadNextQuestion() {
    if (currentQuestionNumber >= filteredQuestions.length) {
        showFinalResults();
        return;
    }
    currentQuestion = filteredQuestions[currentQuestionNumber];
    currentQuestionNumber++;
    displayQuestion();
    updateProgressBar();
}

// Afficher la question
function displayQuestion() {
    const quizContainer = document.getElementById('question-container');
    const propositions = {
        A: currentQuestion["Proposition (A)"] || "",
        B: currentQuestion["Proposition (B)"] || "",
        C: currentQuestion["Proposition (C)"] || "",
        D: currentQuestion["Proposition (D)"] || ""
    };
    const validPropositions = Object.entries(propositions).filter(([_, value]) => value.trim() !== "");
    quizContainer.innerHTML = `
        <div class="progress-container">
            <div class="progress-bar">Question ${currentQuestionNumber}/${filteredQuestions.length}</div>
            <div class="score-display">Score: ${score}</div>
        </div>
        <div class="question-header">
            <span class="badge domaine">${currentQuestion.Domaines}</span>
            <span class="badge theme">${currentQuestion["Thèmes"]}</span>
            <span class="badge niveau">Niveau ${currentQuestion["Niveau de question"]}</span>
        </div>
        <h3>${currentQuestion["Question"]}</h3>
        <form id="answer-form" class="options">
            ${validPropositions.map(([key, value]) => `
                <label><input type="checkbox" name="answer" value="${key}"> <strong>${key}</strong>: ${value}</label>
            `).join('<br>')}
        </form>
        <button onclick="submitAnswers()" class="btn-primary">Valider</button>
    `;
}

// Vérifier la réponse
function submitAnswers() {
    const form = document.getElementById('answer-form');
    const selectedOptions = Array.from(form.querySelectorAll('input[name="answer"]:checked')).map(input => input.value);

    const rawAnswers = currentQuestion["Bonne réponse"];
    const correctAnswers = typeof rawAnswers === 'string'
        ? rawAnswers.split(',').map(s => s.trim())
        : Array.isArray(rawAnswers) ? rawAnswers : [rawAnswers];

    const isCorrect = selectedOptions.length === correctAnswers.length && selectedOptions.every(val => correctAnswers.includes(val));
    const points = parseInt(currentQuestion["Niveau de question"]);
    if (isCorrect) {
        score += points;
        updateScoreDisplay();
    }

    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `
        <h4>${isCorrect ? '✅ Correct !' : '❌ Faux'}</h4>
        ${!isCorrect ? `<p><strong>Bonne(s) réponse(s) :</strong> ${correctAnswers.join(', ')}</p>` : ''}
        ${currentQuestion.commentaires ? `<p><strong>Explication :</strong> ${currentQuestion.commentaires}</p>` : ''}
        <p>${isCorrect ? '+' + points + ' points' : '0 point'}</p>
        <button onclick="loadNextQuestion()" class="btn-primary">
            ${currentQuestionNumber < filteredQuestions.length ? 'Question suivante' : 'Voir les résultats'}
        </button>
    `;
    form.appendChild(feedback);
    form.querySelectorAll('input[name="answer"]').forEach(input => input.disabled = true);
}

// Résultats finaux
function showFinalResults() {
    const maxScore = filteredQuestions.reduce((sum, q) => sum + parseInt(q["Niveau de question"]), 0);
    document.getElementById('quiz-interface').innerHTML = `
        <div class="results-container">
            <h2>Résultats du Quiz</h2>
            <div class="final-score">Score final: ${score}/${maxScore}</div>
            <div class="max-score">${Math.round((score / maxScore) * 100)}% de bonnes réponses</div>
            <button onclick="location.reload()" class="btn-primary">Recommencer</button>
        </div>
    `;
}

// Mettre à jour la barre de progression
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.textContent = `Question ${currentQuestionNumber}/${filteredQuestions.length}`;
    }
}

// Mettre à jour l'affichage du score
function updateScoreDisplay() {
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    document.getElementById('start-btn').addEventListener('click', startQuiz);
});
