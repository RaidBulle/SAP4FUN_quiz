import { loadQuestions } from './data-loader.js';
import { initUI } from './ui.js';
import './events.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Afficher un état de chargement
        const quizContainer = document.getElementById('quiz-container');
        const configContainer = document.getElementById('config-container');
        
        configContainer.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p>Chargement des questions...</p>
            </div>
        `;

        const questions = await loadQuestions();
        
        if (questions.length === 0) {
            throw new Error("Aucune question valide n'a été chargée");
        }
        
        // Restaurer l'interface initiale
        configContainer.innerHTML = `
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
        `;
        
        // Initialiser l'UI avec les questions chargées
        initUI(questions);
        
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        document.getElementById('config-container').innerHTML = `
            <div class="error-container">
                <h2>Erreur de chargement</h2>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" class="btn-primary">Réessayer</button>
            </div>
        `;
    }
});
