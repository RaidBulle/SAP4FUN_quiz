// Variables globales
let questionsData = {};
let currentQuestion = {};
let score = 0;
let selectedDomain = '';
let selectedTheme = '';

// Charger les questions
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questionsData = data;
    initDomaines();
  });

// Initialiser les sélecteurs
function initDomaines() {
  const domaineSelect = document.getElementById('domaine-select');
  
  questionsData.domaines.forEach(domaine => {
    const option = document.createElement('option');
    option.value = domaine.nom;
    option.textContent = domaine.nom;
    domaineSelect.appendChild(option);
  });

  domaineSelect.addEventListener('change', updateThemes);
}

// Mettre à jour les thèmes
function updateThemes() {
  selectedDomain = this.value;
  const themeSelect = document.getElementById('theme-select');
  themeSelect.innerHTML = '<option value="">Sélectionnez un thème</option>';

  const domaine = questionsData.domaines.find(d => d.nom === selectedDomain);
  domaine.themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.nom;
    option.textContent = theme.nom;
    themeSelect.appendChild(option);
  });
}

// Démarrer le quiz
document.getElementById('start-btn').addEventListener('click', () => {
  selectedTheme = document.getElementById('theme-select').value;
  
  if (!selectedDomain || !selectedTheme) {
    alert("Veuillez sélectionner un domaine et un thème !");
    return;
  }

  startQuiz();
});

// Lancer le quiz
function startQuiz() {
  document.getElementById('config').classList.add('hidden');
  document.getElementById('quiz-interface').classList.remove('hidden');
  
  loadNextQuestion();
}

// Charger une question
function loadNextQuestion() {
  const domaine = questionsData.domaines.find(d => d.nom === selectedDomain);
  const theme = domaine.themes.find(t => t.nom === selectedTheme);
  
  // Sélection aléatoire ou séquentielle
  const randomIndex = Math.floor(Math.random() * theme.questions.length);
  currentQuestion = theme.questions[randomIndex];

  displayQuestion();
}

// Afficher la question
function displayQuestion() {
  const quizContainer = document.getElementById('question-container');
  quizContainer.innerHTML = `
    <div class="question-header">
      <span class="badge domaine">${selectedDomain}</span>
      <span class="badge theme">${selectedTheme}</span>
      <span class="badge niveau">${currentQuestion.niveau}</span>
      <span class="badge id">Question #${currentQuestion.id}</span>
    </div>
    
    <h3>${currentQuestion.enonce}</h3>
    
    <div class="options">
      ${Object.entries(currentQuestion.propositions).map(([key, value]) => `
        <button onclick="checkAnswer('${key}')" class="option-btn">
          <span class="option-key">${key}</span>: ${value}
        </button>
      `).join('')}
    </div>
    
    <div class="progress">Score: ${score}</div>
  `;
}

// Vérifier la réponse
function checkAnswer(selectedKey) {
  const isCorrect = selectedKey === currentQuestion.bonne_reponse;
  const feedback = document.createElement('div');
  
  feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.innerHTML = `
    <h4>${isCorrect ? '✅ Correct !' : '❌ Faux'}</h4>
    <p><strong>Explications :</strong> ${currentQuestion.explications}</p>
    ${currentQuestion.references ? `<p class="refs">Référence : ${currentQuestion.references}</p>` : ''}
    <button onclick="loadNextQuestion()">Question suivante</button>
  `;

  if (isCorrect) score++;
  
  document.getElementById('question-container').appendChild(feedback);
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
}