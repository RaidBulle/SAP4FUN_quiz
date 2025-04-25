// dataLoader.js

export async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        if (!response.ok) {
            throw new Error(`Erreur de chargement : ${response.statusText}`);
        }

        const data = await response.json();

        // Nettoyage : on s'assure que toutes les valeurs nulles sont converties en chaînes vides
        const cleanedData = data.map(q => ({
            ...q,
            "Proposition (A)": q["Proposition (A)"] ?? "",
            "Proposition (B)": q["Proposition (B)"] ?? "",
            "Proposition (C)": q["Proposition (C)"] ?? "",
            "Proposition (D)": q["Proposition (D)"] ?? "",
            "commentaires": q["commentaires"] ?? ""
        }));

        return cleanedData;
    } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
        alert("Impossible de charger les questions. Vérifiez le fichier JSON.");
        return [];
    }
}
