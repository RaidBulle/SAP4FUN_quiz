class Question {
    constructor(data) {
        this.id = data["Questions N°"];
        this.domain = data["Domaines"];
        this.theme = data["Thèmes"];
        this.level = data["Niveau de question"];
        this.text = data["Question"];
        this.options = {
            A: data["Proposition (A)"] ?? "",
            B: data["Proposition (B)"] ?? "",
            C: data["Proposition (C)"] ?? "",
            D: data["Proposition (D)"] ?? ""
        };
        this.correctAnswer = data["Bonne réponse"];
        this.comments = data["commentaires"] ?? "";
    }
}

export async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error("Les données doivent être un tableau");
        }

        return data
            .map(q => {
                // Validation des champs requis
                if (!q["Question"] || !q["Bonne réponse"]) {
                    console.warn("Question incomplète ignorée:", q["Questions N°"]);
                    return null;
                }
                
                return new Question({
                    ...q,
                    "Proposition (A)": q["Proposition (A)"] ?? "",
                    "Proposition (B)": q["Proposition (B)"] ?? "",
                    "Proposition (C)": q["Proposition (C)"] ?? "",
                    "Proposition (D)": q["Proposition (D)"] ?? "",
                    "commentaires": q["commentaires"] ?? ""
                });
            })
            .filter(Boolean); // Filtrer les questions invalides
    } catch (error) {
        console.error("Erreur de chargement:", error);
        alert("Erreur de chargement des questions. Voir la console pour plus de détails.");
        return [];
    }
}

export function getUniqueDomains(questions) {
    return [...new Set(questions.map(q => q.domain))];
}
