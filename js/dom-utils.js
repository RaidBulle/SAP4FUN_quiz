export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });

    return element;
}

export function clearElement(element) {
    // Vérifier si l'élément existe avant d'essayer d'accéder à ses propriétés
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

export function disableElements(...elements) {
    elements.forEach(el => {
        if (el) el.disabled = true;
    });
}

export function enableElements(...elements) {
    elements.forEach(el => {
        if (el) el.disabled = false;
    });
}
