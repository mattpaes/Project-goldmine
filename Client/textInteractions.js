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
        return;
    }
    
    const range = selection.getRangeAt(0);
    const overlappingSpan = checkStyledOverlap(range);
    
    if (overlappingSpan) {
        window.toggleExistingStyle(overlappingSpan, className);  // Modified
    } else {
        applyNewStyle(range, className);
    }
    
    selection.removeAllRanges();
    removeSelectionIcons();
};

const checkStyledOverlap = (range) => {
    const styledSpans = document.querySelectorAll('.highlighted-text, .underlined-text, .bold-text');
    for (const span of styledSpans) {
        if (range.intersectsNode(span)) {
            return span;
        }
    }
    return null;
};

// Add to window object
window.toggleExistingStyle = (span, className) => {
    span.classList.toggle(className);
    if (!span.classList.length) {
        const parent = span.parentNode;
        while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
    }
};

const applyNewStyle = (range, className) => {
    const spanParent = range.commonAncestorContainer.parentElement;
    if (!spanParent.matches('.highlighted-text, .underlined-text, .bold-text')) {
        const span = document.createElement('span');
        span.className = className;
        range.surroundContents(span);
    }
};

// Add to window object
window.setupTextSelection = () => {
    const content = document.querySelector('.content');
    
    content.addEventListener('mouseup', function(event) {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            removeSelectionIcons();
            
            if (selectedText.length > 0) {
                window.showSelectionIcons(event.clientX, event.clientY);  // Modified
            }
        }, 10);
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.selection-icons')) {
            removeSelectionIcons();
        }
    });
};

// Add to window object
window.showSelectionIcons = (mouseX, mouseY) => {
    const icons = document.createElement('div');
    icons.className = 'selection-icons';
    icons.innerHTML = `
        <i class="fas fa-highlighter" title="Highlight" data-action="highlight"></i>
        <i class="fas fa-underline" title="Underline" data-action="underline"></i>
        <i class="fas fa-bold" title="Bold" data-action="bold"></i>
    `;

    icons.style.position = 'absolute';
    icons.style.left = `${mouseX + window.scrollX + 10}px`;
    icons.style.top = `${mouseY + window.scrollY}px`;

    icons.querySelectorAll('i').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            window.handleTextActions[action]?.(window.getSelection());
        });
    });

    document.body.appendChild(icons);
};

const removeSelectionIcons = () => {
    const existingIcons = document.querySelector('.selection-icons');
    if (existingIcons) {
        existingIcons.remove();
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', window.setupTextSelection);