// Variables globales
let questionsData = [];
let currentQuestion = {};
let score = 0;
let selectedDomain = '';
let selectedTheme = '';

// Charger les questions depuis un fichier JSON (à implémenter)
// Cette fonction serait utilisée pour charger les données initiales
function loadQuestions() {
    fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questionsData = data;
      initDomaines();
    })
    .catch(error => {
      console.error("Erreur lors du chargement des questions:", error);
      // Fallback avec des données de test en cas d'erreur
      initTestData();
    });
}

// Initialiser les sélecteurs de domaines
function initDomaines() {
  const domaineSelect = document.getElementById('domaine-select');
  domaineSelect.innerHTML = '<option value="">Sélectionnez un domaine</option>';
  
  // Récupérer tous les domaines uniques
  const domaines = [...new Set(questionsData.map(q => q.Domaines))];
  
  domaines.forEach(domaine => {
    const option = document.createElement('option');
    option.value = domaine;
    option.textContent = domaine;
    domaineSelect.appendChild(option);
  });

  // Ajouter l'écouteur d'événement pour mettre à jour les thèmes
  domaineSelect.addEventListener('change', updateThemes);
}

// Mettre à jour les thèmes en fonction du domaine sélectionné
function updateThemes() {
  selectedDomain = this.value;
  const themeSelect = document.getElementById('theme-select');
  themeSelect.innerHTML = '<option value="">Sélectionnez un thème</option>';

  // Récupérer les thèmes uniques pour le domaine sélectionné
  const themes = [...new Set(
    questionsData
      .filter(q => q.Domaines === selectedDomain)
      .map(q => q["Thémes"])
  )];
  
  themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    themeSelect.appendChild(option);
  });
}

// Charger la question suivante
function loadNextQuestion() {
  const questions = questionsData.filter(q => 
    q.Domaines === selectedDomain && 
    q["Thémes"] === selectedTheme
  );

  if (questions.length === 0) {
    alert("Aucune question disponible pour ce domaine et ce thème.");
    return;
  }
  
  // Sélection aléatoire d'une question
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  displayQuestion();
}

// Afficher la question
function displayQuestion() {
  const quizContainer = document.getElementById('question-container');
  
  // Nettoyer les propositions vides
  const propositions = {
    A: currentQuestion["Proposition (A)"] || "",
    B: currentQuestion["Proposition (B)"] || "",
    C: currentQuestion["Proposition (C)"] || "",
    D: currentQuestion["Proposition (D)"] || ""
  };
  
  // Filtrer les propositions non vides
  const validPropositions = Object.entries(propositions)
    .filter(([_, value]) => value && value.trim() !== "");

  quizContainer.innerHTML = `
    <div class="question-header">
      <span class="badge domaine">${currentQuestion.Domaines}</span>
      <span class="badge theme">${currentQuestion["Thémes"]}</span>
      <span class="badge niveau">Niveau ${currentQuestion["Niveau de question"] || "N/A"}</span>
      <span class="badge id">${currentQuestion["Questions Num"] || "N/A"}</span>
    </div>

    <h3>${currentQuestion["Enoncé"]}</h3>

    <div class="options">
      ${validPropositions.map(([key, value]) => `
        <button onclick="checkAnswer('${key}')" class="option-btn">
          <span class="option-key">${key}</span>: ${value}
        </button>
      `).join('')}
    </div>
  `;
}

// Vérifier la réponse
function checkAnswer(selectedKey) {
  const isCorrect = selectedKey === currentQuestion["Bonne réponse"];
  const feedback = document.createElement('div');
  
  feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.innerHTML = `
    <h4>${isCorrect ? '✅ Correct !' : '❌ Faux'}</h4>
    <p><strong>Explications :</strong> ${currentQuestion["Explications"] || "Aucune explication disponible."}</p>
    ${currentQuestion["Références"] ? `<p class="refs">Référence : ${currentQuestion["Références"]}</p>` : ''}
    <button onclick="loadNextQuestion()">Question suivante</button>
  `;

  if (isCorrect) score++;
  
  document.getElementById('question-container').appendChild(feedback);
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

  loadNextQuestion();
}

// Démarrer le quiz
function startQuiz() {
  document.getElementById('config').classList.add('hidden');
  document.getElementById('quiz-interface').classList.remove('hidden');
  
  loadNextQuestion();
}

// Initialisation des événements
document.addEventListener('DOMContentLoaded', () => {
    // Charger les questions et initialiser l'interface
    loadQuestions();
}
  
  // Événement pour le bouton de démarrage
  document.getElementById('start-btn').addEventListener('click', () => {
    selectedTheme = document.getElementById('theme-select').value;
    
    if (!selectedDomain || !selectedTheme) {
      alert("Veuillez sélectionner un domaine et un thème !");
      return;
    }
  
    startQuiz();
  });
});