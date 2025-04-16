// Variables globales
let questionsData = [];
let currentQuestion = {};
let score = 0;
let selectedDomain = '';
let selectedTheme = '';
let filteredQuestions = [];

// Charger les questions
function loadQuestions() {
    fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questionsData = data;
      initDomaines();
    })
    .catch(error => {
      console.error("Erreur lors du chargement des questions:", error);
      initTestData();
    });
}

// Initialiser les sélecteurs de domaines
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

  domaineSelect.addEventListener('change', updateThemes);
}

// Mettre à jour les thèmes
function updateThemes() {
  selectedDomain = this.value;
  const themeSelect = document.getElementById('theme-select');
  themeSelect.innerHTML = '<option value="">Sélectionnez un thème</option>';

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

// Démarrer le quiz
function startQuiz() {
  selectedTheme = document.getElementById('theme-select').value;
  
  if (!selectedDomain || !selectedTheme) {
    alert("Veuillez sélectionner un domaine et un thème !");
    return;
  }

  // Filtrer une seule fois au démarrage
  filteredQuestions = questionsData.filter(q => 
    q.Domaines === selectedDomain && 
    q["Thémes"] === selectedTheme
  );

  if (filteredQuestions.length === 0) {
    alert("Aucune question disponible pour cette combinaison.");
    return;
  }

  document.getElementById('config').classList.add('hidden');
  document.getElementById('quiz-interface').classList.remove('hidden');
  
  loadNextQuestion();
}

// Charger la question suivante
function loadNextQuestion() {
  if (filteredQuestions.length === 0) {
    alert(`Quiz terminé ! Score final : ${score}`);
    return;
  }

  // Sélection aléatoire et suppression pour éviter les répétitions
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  currentQuestion = filteredQuestions.splice(randomIndex, 1)[0];
  
  displayQuestion();
}

// Afficher la question
function displayQuestion() {
  const quizContainer = document.getElementById('question-container');
  quizContainer.innerHTML = ''; // Nettoyer le contenu précédent

  const propositions = {
    A: currentQuestion["Proposition (A)"] || "",
    B: currentQuestion["Proposition (B)"] || "",
    C: currentQuestion["Proposition (C)"] || "",
    D: currentQuestion["Proposition (D)"] || ""
  };
  
  const validPropositions = Object.entries(propositions)
    .filter(([_, value]) => value.trim() !== "");

  const questionHTML = `
    <div class="question-header">
      <span class="badge domaine">${currentQuestion.Domaines}</span>
      <span class="badge theme">${currentQuestion["Thémes"]}</span>
      <span class="badge niveau">Niveau ${currentQuestion["Niveau de question"]}</span>
      <span class="badge id">${currentQuestion["Questions Num"]}</span>
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

  quizContainer.innerHTML = questionHTML;
}

// Vérifier la réponse
function checkAnswer(selectedKey) {
  const isCorrect = selectedKey === currentQuestion["Bonne réponse"];
  const feedback = document.createElement('div');
  
  feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.innerHTML = `
    <h4>${isCorrect ? '✅ Correct !' : '❌ Faux'}</h4>
    ${currentQuestion.commentaires ? `<p><strong>Commentaire :</strong> ${currentQuestion.commentaires}</p>` : ''}
    <button onclick="loadNextQuestion()" class="next-btn">
      ${filteredQuestions.length > 0 ? 'Question suivante' : 'Voir le score final'}
    </button>
  `;

  if (isCorrect) score++;
  
  document.getElementById('question-container').appendChild(feedback);
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
  
  document.getElementById('start-btn').addEventListener('click', startQuiz);
});