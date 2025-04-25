export let questionsData = [];
export let domainesList = [];

export async function loadData() {
  const response = await fetch('data/questions.json');
  const rawData = await response.json();

  questionsData = rawData;

  // Création de la liste des domaines uniques
  const domainesSet = new Set();
  rawData.forEach(item => {
    if (item["Domaines"]) {
      domainesSet.add(item["Domaines"]);
    }
  });

  domainesList = [...domainesSet];
}
