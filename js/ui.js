import { createElement, clearElement, disableElements, enableElements } from './dom-utils.js';

export function initUI(questions) {
    const domainSelect = document.getElementById('domain-select');
    const themeSelect = document.getElementById('theme-select');
    const startBtn = document.getElementById('start-btn');
    
    populateDomainDropdown(domainSelect, questions);
    
    domainSelect.addEventListener('change', () => {
        const selectedDomain = domainSelect.value;
        populateThemeDropdown(themeSelect, questions, selectedDomain);
        themeSelect.disabled = !selectedDomain;
    });
    
    startBtn.addEventListener('click', () => {
        const selectedDomain = domainSelect.value;
        const selectedTheme = themeSelect.value;
        
        if (!selectedDomain || !selectedTheme) {
            alert('Veuillez sélectionner un domaine et un thème');
            return;
        }
        
        startQuiz(selectedDomain, selectedTheme, questions);
    });
}

function populateDomainDropdown(selectElement, questions) {
    clearElement(selectElement);
    
    const domains = [...new Set(questions.map(q => q.domain))].sort();
    
    selectElement.appendChild(
        createElement('option', { 
            value: '', 
            disabled: true, 
            selected: true 
        }, 'Sélectionnez un domaine')
    );
    
    domains.forEach(domain => {
        selectElement.appendChild(
            createElement('option', { value: domain }, domain)
        );
    });
}

function populateThemeDropdown(selectElement, questions, domain) {
    clearElement(selectElement);
    
    const themes = [...new Set(questions
        .filter(q => q.domain === domain)
        .map(q => q.theme))
    ].sort();
    
    selectElement.appendChild(
        createElement('option', { 
            value: '', 
            disabled: true, 
            selected: true 
        }, 'Sélectionnez un thème')
    );
    
    themes.forEach(theme => {
        selectElement.appendChild(
            createElement('option', { value: theme }, theme)
        );
    });
    
    enableElements(selectElement);
}
