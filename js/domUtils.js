// Remplit la liste déroulante des domaines
export function populateDomains(domainSelectElement, questionsData) {
    const uniqueDomains = [...new Set(questionsData.map(q => q.Domaines))];
    
    domainSelectElement.innerHTML = '<option value="">Sélectionnez un domaine</option>';

    uniqueDomains.forEach(domain => {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        domainSelectElement.appendChild(option);
    });
}

// Remplit la liste déroulante des thèmes selon le domaine sélectionné
export function populateThemes(themeSelectElement, questionsData, selectedDomain) {
    const filteredThemes = questionsData
        .filter(q => q.Domaines === selectedDomain)
        .map(q => q.Thèmes);

    const uniqueThemes = [...new Set(filteredThemes)];

    themeSelectElement.innerHTML = '<option value="">Sélectionnez un thème</option>';

    uniqueThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeSelectElement.appendChild(option);
    });
}

// Supprime tous les enfants d'un élément DOM (utile pour nettoyer)
export function clearElementChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
