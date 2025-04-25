import { loadQuestions } from './data-loader.js';
import { initUI } from './ui.js';

// Fonction pour enregistrer les erreurs globales
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Erreur globale:', event.error);
        
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="error-container">
                    <h2>Erreur de chargement</h2>
                    <p>${event.error?.message || 'Une erreur inattendue s\'est produite'}</p>
                    <button onclick="window.location.reload()">Réessayer</button>
                </div>
            `;
        }
    });
}

// Initialisation de l'application
async function initApp() {
    console.log("Initialisation de l'application...");
    setupErrorHandling();
    
    try {
        const appContainer = document.getElementById('app-container');
        
        // Vérifier que l'élément app-container existe
        if (!appContainer) {
            throw new Error("L'élément #app-container est introuvable dans le DOM");
        }
        
        // Afficher un loader pendant le chargement
        appContainer.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p>Chargement des questions...</p>
            </div>
        `;
        
        console.log("Chargement des questions...");
        const questions = await loadQuestions();
        
        console.log(`${questions.length} questions chargées`);
        
        if (questions.length === 0) {
            throw new Error("Aucune question valide n'a été chargée");
        }
        
        // Injecter le HTML de l'interface
        console.log("Création de l'interface...");
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
            <div id="quiz-container" style="display: none;">
                <div class="quiz-header">
                    <div id="progress-counter" class="badge">0/0</div>
                    <div id="score-counter" class="badge">Score: 0</div>
                </div>
                <div id="question-container"></div>
                <div id="feedback" class="feedback"></div>
            </div>
        `;
        
        // Attendre que le DOM soit mis à jour avant d'initialiser l'UI
        console.log("Initialisation de l'UI...");
        setTimeout(() => {
            // Initialiser l'UI avec les questions chargées
            initUI(questions);
        }, 10);
        
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="error-container">
                    <h2>Erreur de chargement</h2>
                    <p>${error.message}</p>
                    <p>Consultez la console pour plus de détails (F12)</p>
                    <button onclick="window.location.reload()">Réessayer</button>
                </div>
            `;
        }
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initApp);
