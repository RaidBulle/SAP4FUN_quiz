import { questionsData, domainesList } from './dataLoader.js';

export function populateDomainDropdown(selectElement) {
  selectElement.innerHTML = '<option disabled selected>Choisissez un domaine</option>';
  domainesList.forEach(domaine => {
    const option = document.createElement('option');
    option.value = domaine;
    option.textContent = domaine;
    selectElement.appendChild(option);
  });
}

export function populateThemeDropdown(selectElement, selectedDomaine) {
  selectElement.innerHTML = '<option disabled selected>Choisissez un thème</option>';
  
  const themeSet = new Set();
  questionsData.forEach(q => {
    if (q["Domaines"] === selectedDomaine && q["Thèmes"]) {
      themeSet.add(q["Thèmes"]);
    }
  });

  [...themeSet].forEach(theme => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    selectElement.appendChild(option);
  });
}
