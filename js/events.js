export function setupEventListeners() {
    // Gestion des sélections d'options
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            const optionBtns = document.querySelectorAll('.option-btn');
            optionBtns.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
    
    // Gestion du clavier
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(key)) {
            const optionBtn = document.getElementById(`option-${key}`);
            if (optionBtn) {
                optionBtn.click();
                optionBtn.focus();
            }
        }
    });
}

// Initialisation
setupEventListeners();
