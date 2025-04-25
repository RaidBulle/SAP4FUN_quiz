import { questionsData } from './dataLoader.js';
import { renderQuestion } from './questionRenderer.js';

let filteredQuestions = [];
let currentQuestion = null;

export function startQuiz(domaine, theme) {
  // On filtre les questions selon le domaine et le thème
  filteredQuestions = questionsData.filter(q => 
    q["Domaines"] === domaine && q["Thèmes"] === theme
  );

  if (filteredQuestions.length > 0) {
    showNextQuestion();
  } else {
    document.getElementById('quiz-container').innerHTML = 'Aucune question disponible.';
  }
}

function showNextQuestion() {
  if (filteredQuestions.length === 0) return;

  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  currentQuestion = filteredQuestions[randomIndex];
  renderQuestion(currentQuestion, handleAnswer);
}

function handleAnswer(choice) {
  const correct = currentQuestion["Bonne réponse"];
  const resultDiv = document.getElementById('result');

  if (choice === correct) {
    resultDiv.textContent = "Bonne réponse ✅";
    resultDiv.style.color = "green";
  } else {
    resultDiv.textContent = `Mauvaise réponse ❌ (Bonne réponse : ${correct})`;
    resultDiv.style.color = "red";
  }

  setTimeout(() => {
    resultDiv.textContent = "";
    showNextQuestion();
  }, 2000);
}
