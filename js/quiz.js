import { renderQuestion } from './question-renderer.js';

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = -1;
        this.score = 0;
        this.answeredQuestions = new Set();
    }

    getNextQuestion() {
        const availableQuestions = this.questions
            .map((_, index) => index)
            .filter(index => !this.answeredQuestions.has(index));

        if (availableQuestions.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        this.currentQuestionIndex = availableQuestions[randomIndex];
        this.answeredQuestions.add(this.currentQuestionIndex);
        
        return this.questions[this.currentQuestionIndex];
    }

    checkAnswer(answer) {
        const isCorrect = this.getCurrentQuestion().correctAnswer === answer;
        if (isCorrect) this.score++;
        return isCorrect;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    getProgress() {
        return {
            current: this.answeredQuestions.size,
            total: this.questions.length,
            score: this.score
        };
    }

    isComplete() {
        return this.answeredQuestions.size >= this.questions.length;
    }
}

let quizInstance = null;

export function startQuiz(domain, theme, questions) {
    const filteredQuestions = questions.filter(q => 
        q.domain === domain && (q.theme === theme || theme === "tous")
    );

    if (filteredQuestions.length === 0) {
        throw new Error("Aucune question disponible pour cette combinaison domaine/thème");
    }

    // Masquer le conteneur de configuration et afficher le conteneur de quiz
    const configContainer = document.getElementById('config-container');
    const quizContainer = document.getElementById('quiz-container');
    
    if (configContainer) configContainer.style.display = 'none';
    if (quizContainer) {
        quizContainer.style.display = 'block';
        quizContainer.classList.remove('hidden');
    }

    quizInstance = new Quiz(filteredQuestions);
    showNextQuestion();
}

function showNextQuestion() {
    if (!quizInstance || quizInstance.isComplete()) {
        showFinalResults();
        return;
    }

    const question = quizInstance.getNextQuestion();
    if (!question) {
        showFinalResults();
        return;
    }

    renderQuestion(question, (selectedAnswer) => {
        const isCorrect = quizInstance.checkAnswer(selectedAnswer);
        showFeedback(isCorrect, question.correctAnswer);
        
        setTimeout(() => {
            clearFeedback();
            showNextQuestion();
        }, 1500);
    });

    updateProgress();
}

function showFeedback(isCorrect, correctAnswer) {
    const feedbackEl = document.getElementById('feedback');
    if (!feedbackEl) return;
    
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'} show`;
    
    feedbackEl.innerHTML = isCorrect
        ? '✅ Bonne réponse!'
        : `❌ Mauvaise réponse. La bonne réponse était: <span class="correct-answer">${correctAnswer}</span>`;
}

function clearFeedback() {
    const feedbackEl = document.getElementById('feedback');
    if (!feedbackEl) return;
    
    feedbackEl.className = 'feedback';
    feedbackEl.innerHTML = '';
}

function updateProgress() {
    if (!quizInstance) return;
    
    const progress = quizInstance.getProgress();
    const progressCounter = document.getElementById('progress-counter');
    const scoreCounter = document.getElementById('score-counter');
    
    if (progressCounter) {
        progressCounter.textContent = `${progress.current}/${progress.total}`;
    }
    
    if (scoreCounter) {
        scoreCounter.textContent = `Score: ${progress.score}`;
    }
}

function showFinalResults() {
    if (!quizInstance) return;
    
    const progress = quizInstance.getProgress();
    const container = document.getElementById('quiz-container');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="results-container">
            <h2>Quiz terminé!</h2>
            <div class="final-score">Score final: ${progress.score}/${progress.total}</div>
            <div class="percentage">${Math.round((progress.score / progress.total) * 100)}% de bonnes réponses</div>
            <button id="restart-btn" class="btn-primary">Recommencer</button>
        </div>
    `;
    
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            location.reload(); // Recharger la page pour recommencer
        });
    }
}
