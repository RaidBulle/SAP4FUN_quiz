// dataLoader.js
let questionsData = [];

function loadQuestions() {
    fetch('data/questions.json')
        .then(response => {
            if (!response.ok) throw new Error('Erreur de réseau');
            return response.json();
        })
        .then(data => {
            questionsData = data;
            initDomaines();
        })
        .catch(error => {
            console.error("Erreur lors du chargement des questions:", error);
            alert("Erreur lors du chargement des questions. Veuillez recharger la page.");
        });
}
