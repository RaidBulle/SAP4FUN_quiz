export function renderQuestion(question, answerCallback) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  const questionTitle = document.createElement('h2');
  questionTitle.textContent = question["Question"];
  container.appendChild(questionTitle);

  ['A', 'B', 'C', 'D'].forEach(letter => {
    const propKey = `Proposition (${letter})`;
    const propText = question[propKey];
    if (propText) {
      const button = document.createElement('button');
      button.textContent = `${letter} : ${propText}`;
      button.addEventListener('click', () => answerCallback(letter));
      button.style.display = 'block';
      button.style.margin = '10px 0';
      container.appendChild(button);
    }
  });
}
