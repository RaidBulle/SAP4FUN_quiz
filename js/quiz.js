import { renderQuestion } from './question-renderer.js';

class Quiz {
    constructor(questions) {
        // Organisation des questions par niveau
        const level1Questions = questions.filter(q => q.level === "1" || q.level === 1);
        const level2Questions = questions.filter(q => q.level === "2" || q.level === 2);
        const level3Or4Questions = questions.filter(q => q.level === "3" || q.level === 3 || q.level === "4" || q.level === 4);
        
        // Mélanger les questions dans chaque niveau
        this.shuffleArray(level1Questions);
        this.shuffleArray(level2Questions);
        this.shuffleArray(level3Or4Questions);
        
        // Prendre les nombres requis de chaque niveau
        const selectedLevel1 = level1Questions.slice(0, 5);
        const selectedLevel2 = level2Questions.slice(0, 3);
        const selectedLevel3Or4 = level3Or4Questions.slice(0, 2);
        
        // Si nous n'avons pas assez de questions dans un niveau, compléter avec des questions d'autres niveaux
        this.questions = [];
        
        // Ajouter les questions de niveau 1 (5 questions)
        this.questions = this.questions.concat(selectedLevel1);
        
        // S'il manque des questions de niveau 1, ajouter d'autres questions de niveau 2
        if (selectedLevel1.length < 5) {
            const additionalLevel2 = level2Questions.slice(selectedLevel2.length, selectedLevel2.length + (5 - selectedLevel1.length));
            this.questions = this.questions.concat(additionalLevel2);
            // Mettre à jour selectedLevel2 pour éviter de réutiliser ces questions
            const remainingLevel2 = level2Questions.slice(selectedLevel2.length + additionalLevel2.length);
            selectedLevel2.splice(0); // Vider le tableau
            selectedLevel2.push(...level2Questions.slice(0, 3)); // Réajouter jusqu'à 3 questions
        }
        
        // Ajouter les questions de niveau 2 (3 questions)
        this.questions = this.questions.concat(selectedLevel2);
        
        // S'il manque des questions de niveau 2, ajouter d'autres questions de niveau 3/4
        if (this.questions.length < 8) {
            const additionalLevel3Or4 = level3Or4Questions.slice(selectedLevel3Or4.length, selectedLevel3Or4.length + (8 - this.questions.length));
            this.questions = this.questions.concat(additionalLevel3Or4);
            // Mettre à jour selectedLevel3Or4 pour éviter de réutiliser ces questions
            const remainingLevel3Or4 = level3Or4Questions.slice(selectedLevel3Or4.length + additionalLevel3Or4.length);
            selectedLevel3Or4.splice(0); // Vider le tableau
            selectedLevel3Or4.push(...level3Or4Questions.slice(0, 2)); // Réajouter jusqu'à 2 questions
        }
        
        // Ajouter les questions de niveau 3/4 (2 questions)
        this.questions = this.questions.concat(selectedLevel3Or4);
        
        // S'il manque encore des questions, ajouter des questions de n'importe quel niveau
        if (this.questions.length < 10) {
            const allRemainingQuestions = questions.filter(q => !this.questions.includes(q));
            this.shuffleArray(allRemainingQuestions);
            this.questions = this.questions.concat(allRemainingQuestions.slice(0, 10 - this.questions.length));
        }
        
        // Limiter à 10 questions maximum
        this.questions = this.questions.slice(0, 10);
        
        this.currentQuestionIndex = -1;
        this.score = 0;
        this.answeredQuestions = new Set();
        this.currentQuestionOrder = 0; // Nouvel attribut pour suivre l'ordre séquentiel
    }
    
    // Méthode pour mélanger un tableau (algorithme de Fisher-Yates)
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getNextQuestion() {
        if (this.currentQuestionOrder >= this.questions.length) {
            return null;
        }
        
        // Sélectionner la question suivante dans l'ordre séquentiel
        this.currentQuestionIndex = this.currentQuestionOrder;
        this.answeredQuestions.add(this.currentQuestionIndex);
        this.currentQuestionOrder++;
        
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
    
    // Vérifier s'il y a suffisamment de questions par niveau pour un quiz idéal
    const level1Count = filteredQuestions.filter(q => q.level === "1" || q.level === 1).length;
    const level2Count = filteredQuestions.filter(q => q.level === "2" || q.level === 2).length;
    const level3Or4Count = filteredQuestions.filter(q => q.level === "3" || q.level === 3 || q.level === "4" || q.level === 4).length;
    
    // Avertir des potentiels problèmes de distribution mais permettre au quiz de continuer
    if (level1Count < 5) {
        console.warn(`Attention: Seulement ${level1Count} questions de niveau 1 disponibles (5 recommandées)`);
    }
    if (level2Count < 3) {
        console.warn(`Attention: Seulement ${level2Count} questions de niveau 2 disponibles (3 recommandées)`);
    }
    if (level3Or4Count < 2) {
        console.warn(`Attention: Seulement ${level3Or4Count} questions de niveau 3/4 disponibles (2 recommandées)`);
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
        // Montrer une progression fixe sur 10 questions
        progressCounter.textContent = `${progress.current}/10`;
    }
    
    if (scoreCounter) {
        scoreCounter.textContent = `Score: ${progress.score}`;
    }
    
    // Afficher le niveau de difficulté actuel
    const currentQuestion = quizInstance.getCurrentQuestion();
    const levelIndicator = document.getElementById('level-indicator');
    
    if (levelIndicator && currentQuestion) {
        levelIndicator.textContent = `Niveau: ${currentQuestion.level}`;
        levelIndicator.className = `badge level-${currentQuestion.level}-badge`;
    } else if (!levelIndicator && currentQuestion) {
        // Créer l'indicateur de niveau s'il n'existe pas
        const quizHeader = document.querySelector('.quiz-header');
        if (quizHeader) {
            const newLevelIndicator = document.createElement('div');
            newLevelIndicator.id = 'level-indicator';
            newLevelIndicator.className = `badge level-${currentQuestion.level}-badge`;
            newLevelIndicator.textContent = `Niveau: ${currentQuestion.level}`;
            quizHeader.appendChild(newLevelIndicator);
        }
    }
}

function showFinalResults() {
    if (!quizInstance) return;
    
    const progress = quizInstance.getProgress();
    const container = document.getElementById('quiz-container');
    
    if (!container) return;
    
    // Calculer la note sur 20
    const note = Math.round((progress.score / 10) * 20);
    
    // Déterminer un message basé sur la note
    let message = "";
    if (note >= 16) {
        message = "Excellent ! Vous maîtrisez le sujet.";
    } else if (note >= 12) {
        message = "Bien ! Vous avez de bonnes connaissances.";
    } else if (note >= 8) {
        message = "Vous avez les bases, mais revoyez certains concepts.";
    } else {
        message = "Continuez à apprendre jeune padawan.";
    }
    
    container.innerHTML = `
        <div class="results-container">
            <h2>Quiz terminé!</h2>
            <div class="final-score">Score final: ${progress.score}/10</div>
            <div class="note">Note: ${note}/20</div>
            <div class="percentage">${Math.round((progress.score / 10) * 100)}% de bonnes réponses</div>
            <div class="result-message">${message}</div>
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
