import { createElement } from './dom-utils.js';

export function renderQuestion(question, onAnswer) {
    // Utilisation de question-container au lieu de quiz-container directement
    const container = document.getElementById('question-container');
    
    if (!container) {
        // Fallback au quiz-container si question-container n'existe pas
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;
        
        // Créer un question-container s'il n'existe pas
        const questionContainer = createElement('div', { id: 'question-container' });
        quizContainer.appendChild(questionContainer);
        
        // Utiliser le nouveau conteneur
        renderQuestion(question, onAnswer);
        return;
    }
    
    // Nettoyer le conteneur
    container.innerHTML = '';
    
    // Créer la carte de question
    const questionCard = createElement('div', { className: 'question-card' }, [
        createMetaBadges(question),
        createQuestionText(question),
        createOptionsList(question, onAnswer)
    ]);
    
    container.appendChild(questionCard);
}

function createMetaBadges(question) {
    const metaContainer = createElement('div', { className: 'question-meta' });
    
    const badges = [
        { text: question.domain, className: 'domain-badge' },
        { text: question.theme, className: 'theme-badge' },
        { text: `Niveau ${question.level}`, className: 'level-badge' }
    ];
    
    badges.forEach(badge => {
        if (badge.text) {
            metaContainer.appendChild(
                createElement('span', { 
                    className: `badge ${badge.className}`,
                    'data-testid': badge.className
                }, badge.text)
            );
        }
    });
    
    return metaContainer;
}

function createQuestionText(question) {
    return createElement('h2', { 
        className: 'question-text',
        'data-testid': 'question-text'
    }, question.text);
}

function createOptionsList(question, onAnswer) {
    const optionsContainer = createElement('div', { className: 'options-container' });
    
    Object.entries(question.options)
        .filter(([_, value]) => value) // Filtrer les options vides
        .forEach(([key, value]) => {
            const optionBtn = createElement('button', {
                className: 'option-btn',
                id: `option-${key}`,
                'data-option': key,
                'data-testid': `option-${key.toLowerCase()}`
            }, [
                createElement('span', { className: 'option-key' }, `${key}:`),
                ` ${value}`
            ]);
            
            optionBtn.addEventListener('click', () => onAnswer(key));
            optionsContainer.appendChild(optionBtn);
        });
    
    return optionsContainer;
}
