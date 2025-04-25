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
        q.domain === domain && q.theme === theme
    );

    if (filteredQuestions.length === 0) {
        throw new Error("Aucune question disponible pour cette combinaison domaine/thème");
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
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    feedbackEl.innerHTML = isCorrect
        ? '✅ Bonne réponse!'
        : `❌ Mauvaise réponse. La bonne réponse était: <span class="correct-answer">${correctAnswer}</span>`;
}

function clearFeedback() {
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('feedback').innerHTML = '';
}

function updateProgress() {
    if (!quizInstance) return;
    
    const progress = quizInstance.getProgress();
    document.getElementById('progress-counter').textContent = 
        `${progress.current}/${progress.total}`;
    document.getElementById('score-counter').textContent = 
        `${progress.score}`;
}

function showFinalResults() {
    if (!quizInstance) return;
    
    const progress = quizInstance.getProgress();
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="results-container">
            <h2>Quiz terminé!</h2>
            <div class="final-score">Score final: ${progress.score}/${progress.total}</div>
            <div class="percentage">${Math.round((progress.score / progress.total) * 100)}% de bonnes réponses</div>
            <button id="restart-btn" class="btn-primary">Recommencer</button>
        </div>
    `;
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        startQuiz(quizInstance.questions[0].domain, quizInstance.questions[0].theme, quizInstance.questions);
    });
}
