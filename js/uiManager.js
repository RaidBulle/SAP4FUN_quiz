// uiManager.js
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

function updateScoreDisplay() {
    document.querySelector('.score-display').textContent = `Score: ${score}`;
}

function updateProgressBar() {
    document.querySelector('.progress-bar').textContent = `Question ${currentQuestionNumber}/${filteredQuestions.length}`;
}

function showFeedback(isCorrect, correctAnswers, points) {
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
