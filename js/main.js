import { loadQuestions } from './data-loader.js';
import { initUI } from './ui.js';
import './events.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const appContainer = document.getElementById('app-container');
        
        // Vérifier que l'élément app-container existe
        if (!appContainer) {
            throw new Error("L'élément #app-container n'a pas été trouvé");
        }
        
        // Afficher un loader pendant le chargement
        appContainer.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p>Chargement des questions...</p>
            </div>
        `;
        
        const questions = await loadQuestions();
        
        if (questions.length === 0) {
            throw new Error("Aucune question valide n'a été chargée");
        }
        
        // Injecter le HTML de l'interface
        appContainer.innerHTML = `
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
        
        // Attendre que le DOM soit mis à jour avant d'initialiser l'UI
        setTimeout(() => {
            // Réinitialiser l'UI avec les questions chargées
            initUI(questions);
        }, 0);
        
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="error-container">
                    <h2>Erreur de chargement</h2>
                    <p>${error.message}</p>
                    <button onclick="window.location.reload()">Réessayer</button>
                </div>
            `;
        }
    }
});
