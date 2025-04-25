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
        console.log("Tentative de chargement des questions...");
        
        // Modification du chemin pour plus de robustesse
        const response = await fetch('./data/questions.json');
        
        if (!response.ok) {
            console.error(`Erreur HTTP: ${response.status}`);
            // Essayer un chemin alternatif au cas où
            const altResponse = await fetch('./questions.json');
            if (!altResponse.ok) {
                throw new Error(`Impossible de charger le fichier JSON: ${response.status}`);
            }
            return processQuestionsData(await altResponse.json());
        }
        
        const data = await response.json();
        return processQuestionsData(data);
    } catch (error) {
        console.error("Erreur de chargement:", error);
        
        // Créer quelques questions de test pour permettre à l'application de fonctionner
        // même si le JSON ne peut pas être chargé
        console.log("Utilisation de questions de test par défaut");
        return createDefaultQuestions();
    }
}

function processQuestionsData(data) {
    if (!Array.isArray(data)) {
        console.warn("Les données ne sont pas au format attendu (tableau). Tentative de conversion...");
        data = [data]; // Essayer de convertir en tableau si ce n'est pas déjà le cas
    }
    
    if (data.length === 0) {
        console.warn("Aucune donnée trouvée. Utilisation de questions par défaut.");
        return createDefaultQuestions();
    }
    
    console.log(`${data.length} questions chargées avec succès`);
    
    return data
        .map(q => {
            try {
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
            } catch (e) {
                console.error("Erreur lors de la création d'une question:", e);
                return null;
            }
        })
        .filter(Boolean); // Filtrer les questions invalides
}

function createDefaultQuestions() {
    // Questions de test par défaut pour permettre à l'application de fonctionner
    // même sans fichier JSON
    return [
        new Question({
            "Questions N°": "1",
            "Domaines": "SAP Général",
            "Thèmes": "Fondamentaux",
            "Niveau de question": "1",
            "Question": "Que signifie SAP?",
            "Proposition (A)": "System Application Program",
            "Proposition (B)": "Systems Applications and Products in Data Processing",
            "Proposition (C)": "System Analysis and Programming",
            "Proposition (D)": "Software Application Platform",
            "Bonne réponse": "B"
        }),
        new Question({
            "Questions N°": "2",
            "Domaines": "SAP Général",
            "Thèmes": "Fondamentaux",
            "Niveau de question": "1",
            "Question": "En quelle année SAP a-t-elle été fondée?",
            "Proposition (A)": "1972",
            "Proposition (B)": "1980",
            "Proposition (C)": "1992",
            "Proposition (D)": "2000",
            "Bonne réponse": "A"
        }),
        new Question({
            "Questions N°": "3",
            "Domaines": "SAP Général",
            "Thèmes": "Architecture",
            "Niveau de question": "2",
            "Question": "Quel est le nom de la dernière génération de l'ERP SAP?",
            "Proposition (A)": "SAP R/3",
            "Proposition (B)": "SAP S/4HANA",
            "Proposition (C)": "SAP ECC",
            "Proposition (D)": "SAP Business Suite",
            "Bonne réponse": "B"
        })
    ];
}

export function getUniqueDomains(questions) {
    return [...new Set(questions.map(q => q.domain))].filter(Boolean).sort();
}
