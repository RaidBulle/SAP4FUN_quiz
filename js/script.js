// Variables globales
let questionsData = [];
let currentQuestion = {};
let score = 0;
let selectedDomain = '';
let selectedTheme = '';
let filteredQuestions = [];
let currentQuestionNumber = 0;
const MAX_QUESTIONS = 10;
let selectedAnswers = new Set();

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

// Vérifier la réponse
function checkAnswer() {
    // Désactiver le bouton "Valider" pour empêcher les clics multiples
    document.querySelector('.btn-primary').disabled = true;

    const correctAnswers = currentQuestion["Bonne réponse"].split(',').map(a => a.trim());
    const points = parseInt(currentQuestion["Niveau de question"]);
    const isCorrect = correctAnswers.length === selectedAnswers.size && correctAnswers.every(a => selectedAnswers.has(a));
    if (isCorrect) {
        score += points;
        updateScoreDisplay();
    }
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `
        <h4>${isCorrect ? '✅ Correct !' : '❌ Faux'}</h4>
        ${!isCorrect ? `<p><strong>Bonne(s) réponse(s):</strong> ${correctAnswers.join(', ')}</p>` : ''}
        ${currentQuestion.commentaires ? `<p><strong>Explication :</strong> ${currentQuestion.commentaires}</p>` : ''}
        <p>${isCorrect ? '+' + points + ' points' : '0 point'}</p>
        <button onclick="loadNextQuestion()" class="btn-primary">
            ${currentQuestionNumber < filteredQuestions.length ? 'Question suivante' : 'Voir les résultats'}
        </button>
    `;
    document.getElementById('question-container').appendChild(feedback);
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
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
    domaineSelect.addEventListener('change', function() {
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
        questionsData.filter(q => q.Domaines === selectedDomain).map(q => q["Thèmes"])
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
    const isMultiple = currentQuestion["Bonne réponse"].includes(',');
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
        <div class="options">
            ${validPropositions.map(([key, value]) => `
                <button onclick="selectAnswer('${key}', ${isMultiple})" class="option-btn" id="btn-${key}">
                    <span class="option-key">${key}</span>: ${value}
                </button>
            `).join('')}
        </div>
        <button onclick="checkAnswer()" class="btn-primary">Valider</button>
    `;
}

// Sélection d'une réponse
function selectAnswer(key, isMultiple) {
    const btn = document.getElementById(`btn-${key}`);
    if (!isMultiple) {
        selectedAnswers.clear();
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    }
    if (selectedAnswers.has(key)) {
        selectedAnswers.delete(key);
        btn.classList.remove('selected');
    } else {
        selectedAnswers.add(key);
      
    }
}

// Vérifier la réponse
function checkAnswer() {
    const correctAnswers = currentQuestion["Bonne réponse"].split(',').map(a => a.trim());
    const points = parseInt(currentQuestion["Niveau de question"]);
    const isCorrect = correctAnswers.length === selectedAnswers.size && correctAnswers.every(a => selectedAnswers.has(a));
    if (isCorrect) {
        score += points;
        updateScoreDisplay();
    }
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `
        <h4>${isCorrect ? '✅ Correct !' : '❌ Faux'}</h4>
        ${!isCorrect ? `<p><strong>Bonne(s) réponse(s):</strong> ${correctAnswers.join(', ')}</p>` : ''}
        ${currentQuestion.commentaires ? `<p><strong>Explication :</strong> ${currentQuestion.commentaires}</p>` : ''}
        <p>${isCorrect ? '+' + points + ' points' : '0 point'}</p>
        <button onclick="loadNextQuestion()" class="btn-primary">
            ${currentQuestionNumber < filteredQuestions.length ? 'Question suivante' : 'Voir les résultats'}
        </button>
    `;
    document.getElementById('question-container').appendChild(feedback);
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
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

// Exemple de tableau pour suivre les questions validées
const validatedQuestions = new Set();

// Fonction appelée lorsque le bouton "Valider" est cliqué
function validerQuestion(questionId) {
    // Vérifiez si la question a déjà été validée
    if (validatedQuestions.has(questionId)) {
        alert("Cette question a déjà été validée !");
        return;
    }

    // Ajoutez la question à l'ensemble des questions validées
    validatedQuestions.add(questionId);

    // Incrémentez le score ou effectuez l'action nécessaire
    incrementerScore();
}

function incrementerScore() {
    // Exemple d'incrémentation de score
    let scoreElement = document.getElementById("score");
    let score = parseInt(scoreElement.textContent, 10);
    scoreElement.textContent = score + 1;
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
