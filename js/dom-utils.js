export function clearElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    } else {
        console.warn(`Element with ID ${elementId} not found`);
    }
}

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
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

export function disableElements(...elementIds) {
    elementIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });
}

export function enableElements(...elementIds) {
    elementIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = false;
    });
}
