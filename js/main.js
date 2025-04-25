import { loadData } from './dataLoader.js';
import { populateDomainDropdown, populateThemeDropdown } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const domainSelect = document.getElementById('domain-select');
  const themeSelect = document.getElementById('theme-select');

  await loadData();
  populateDomainDropdown(domainSelect);

  domainSelect.addEventListener('change', () => {
    const selectedDomain = domainSelect.value;
    populateThemeDropdown(themeSelect, selectedDomain);
  });

  // Tu peux ajouter ici le reste : affichage des questions, etc.
});


