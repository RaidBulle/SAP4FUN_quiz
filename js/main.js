import { loadQuestions, getUniqueDomains } from './data-loader.js';
import { initUI } from './ui.js';
import './events.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Afficher un loader pendant le chargement
        document.getElementById('app-container').innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p>Chargement des questions...</p>
            </div>
        `;
        
        const questions = await loadQuestions();
        
        if (questions.length === 0) {
            throw new Error("Aucune question valide n'a été chargée");
        }
        
        initUI(questions);
        
        // Cacher le loader et afficher l'interface
        document.getElementById('app-container').innerHTML = `
            <div id="config-container">
                <h1>Quiz SAP</h1>
                <div class="config-form">
                    <div class="select-group">
                        <label for="domain-select">Domaine:</label>
                        <select id="domain-select"></select>
                    </div>
                    <div class="select-group">
                        <label for="theme-select">Thème:</label>
                        <select id="theme-select" disabled></select>
                    </div>
                    <button id="start-btn" class="btn-primary">Commencer le quiz</button>
                </div>
            </div>
            <div id="quiz-container" class="hidden">
                <div class="quiz-header">
                    <div id="progress-counter" class="badge">0/0</div>
                    <div id="score-counter" class="badge">Score: 0</div>
                </div>
                <div id="question-container"></div>
                <div id="feedback" class="feedback"></div>
            </div>
        `;
        
        // Réinitialiser l'UI avec les questions chargées
        initUI(questions);
        
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        document.getElementById('app-container').innerHTML = `
            <div class="error-container">
                <h2>Erreur de chargement</h2>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Réessayer</button>
            </div>
        `;
    }
});
