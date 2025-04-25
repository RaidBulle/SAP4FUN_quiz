// events.js
function selectAnswer(key, isMultiple) {
    const btn = document.getElementById(`btn-${key}`);
    if (!isMultiple) {
        selectedAnswers.clear();
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    }

    if (selectedAnswers.has(key)) {
        selectedAnswers.delete(key);
        btn.classList.remove('selected');
    } else {
        selectedAnswers.add(key);
        btn.classList.add('selected');
    }
}
