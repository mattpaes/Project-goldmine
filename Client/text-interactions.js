// Client/text-interactions.js
window.handleTextActions = {
    highlight: (selection) => {
        applyTextStyle(selection, 'highlighted-text');
    },
    underline: (selection) => {
        applyTextStyle(selection, 'underlined-text');
    },
    bold: (selection) => {
        applyTextStyle(selection, 'bold-text');
    }
};

const applyTextStyle = (selection, className) => {
    if (!selection.rangeCount) {
        return
    };
    
    const range = selection.getRangeAt(0);
    const existingSpan = findStyledParent(range.commonAncestorContainer);
    
    if (existingSpan && existingSpan.classList.contains(className)) {
        existingSpan.classList.remove(className);
        if (!existingSpan.classList.length) {
            unwrapSpan(existingSpan);
        }
    } else if (existingSpan) {
        existingSpan.classList.add(className);
    } else {
        const span = document.createElement('span');
        span.className = className;
        range.surroundContents(span);
    }
    
    selection.removeAllRanges();
};

const findStyledParent = (node) => {
    let current = node;
    while (current && current.nodeType !== Node.ELEMENT_NODE) {
        current = current.parentNode;
    }
    return current && current.matches('span[class*="-text"]') ? current : null;
};

const unwrapSpan = (span) => {
    const parent = span.parentNode;
    while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
};

document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');
    
    if (!content) {
        return
    };

    content.addEventListener('mouseup', function(event) {
        setTimeout(() => {
            const selection = window.getSelection();
            if (!selection.toString().trim()) {
                return
            };

            const icons = document.createElement('div');
            icons.className = 'selection-icons';
            icons.innerHTML = `
                <i class="fas fa-highlighter" data-action="highlight"></i>
                <i class="fas fa-underline" data-action="underline"></i>
                <i class="fas fa-bold" data-action="bold"></i>
            `;
            
            icons.style.position = 'absolute';
            icons.style.left = `${event.pageX + 10}px`;
            icons.style.top = `${event.pageY}px`;

            document.body.appendChild(icons);

            icons.querySelectorAll('i').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = e.target.dataset.action;
                    window.handleTextActions[action]?.(selection);
                    icons.remove();
                });
            });
        }, 0);
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.selection-icons')) {
            document.querySelector('.selection-icons')?.remove();
        }
    });
});