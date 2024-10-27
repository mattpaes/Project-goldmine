// script.js

// The bellow functions make a set of icon appear on the right hand side of any paragraph within <<main>>
// when the mouse is hovering on the right hand side padding. When clicking on one of the icons, there is an 
// update in the styling to keep track of the interaction
// at a later stage, these interactions will be shared on the cloud so that they will be all centralized
// on the teacher screen
function addIconsToParagraphs() {
    const paragraphs = document.querySelectorAll('.content p');
    
    paragraphs.forEach((paragraph, index) => {
        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'paragraph-icons';
        iconsContainer.innerHTML = `
            <i class="fas fa-question-circle" data-action="question" title="Ask a question"></i>
            <i class="fas fa-highlighter" data-action="highlight" title="Highlight"></i>
            <i class="fas fa-comment" data-action="comment" title="Add a comment"></i>
        `;
        paragraph.appendChild(iconsContainer);
        
        // Add hover event listeners
        addHoverEffects(paragraph, iconsContainer);
        
        // Add click event listeners to icons
        iconsContainer.querySelectorAll('i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                handleIconClick(action, 'paragraph', index);
            });
        });
    });
}

function addHoverEffects(paragraph, iconsContainer) {
    const hoverArea = document.createElement('div');
    hoverArea.className = 'hover-area';
    paragraph.appendChild(hoverArea);

    function showIcons() {
        paragraph.classList.add('highlight');
        iconsContainer.style.opacity = '1';
    }

    function hideIcons() {
        paragraph.classList.remove('highlight');
        iconsContainer.style.opacity = '0';
    }

    hoverArea.addEventListener('mouseenter', showIcons);
    iconsContainer.addEventListener('mouseenter', showIcons);

    hoverArea.addEventListener('mouseleave', (event) => {
        if (!iconsContainer.contains(event.relatedTarget)) {
            hideIcons();
        }
    });

    iconsContainer.addEventListener('mouseleave', (event) => {
        if (!hoverArea.contains(event.relatedTarget)) {
            hideIcons();
        }
    });
}

function toggleClass(element, className) {
    element.classList.toggle(className);
}

/*-----------------------------------------------------------------------------------------------------------------*/
// Functions to handle text selection and styling. Multiple styles can be applied to the same text.
// When selecting text that overlaps with existing styled text, the style will be removed from the existing span.
// Only completely new text selections can receive new styles.

function setupTextSelection() {
    const content = document.querySelector('.content');
    
    content.addEventListener('mouseup', function(event) {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            removeSelectionIcons();
            
            if (selectedText.length > 0) {
                showSelectionIcons(event.clientX, event.clientY, selectedText);
            }
        }, 10);
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.selection-icons')) {
            removeSelectionIcons();
        }
    });
}

function showSelectionIcons(mouseX, mouseY, selectedText) {
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
            handleIconClick(action, 'selection', selectedText);
        });
    });

    document.body.appendChild(icons);
}

function removeSelectionIcons() {
    const existingIcons = document.querySelector('.selection-icons');
    if (existingIcons) {
        existingIcons.remove();
    }
}

function checkStyledOverlap(range) {
    const styledSpans = document.querySelectorAll('.highlighted-text, .underlined-text, .bold-text');
    for (const span of styledSpans) {
        if (range.intersectsNode(span)) {
            return span;
        }
    }
    return null;
}

function handleIconClick(action, type, content) {
    if (type === 'paragraph') {
        const paragraph = document.querySelectorAll('.content p')[content];
        switch(action) {
            case 'question':
                toggleClass(paragraph, 'questioned');
                break;
            case 'highlight':
                toggleClass(paragraph, 'highlighted');
                break;
            case 'comment':
                toggleClass(paragraph, 'commented');
                break;
        }
        
    } else if (type === 'selection') {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            return;
        }
        const range = selection.getRangeAt(0);
        const overlappingSpan = checkStyledOverlap(range);
        
        if (overlappingSpan) {
            // If there's overlap, just remove the style
            switch(action) {
                case 'highlight':
                    toggleClass(overlappingSpan, 'highlighted-text');
                    break;
                case 'underline':
                    toggleClass(overlappingSpan, 'underlined-text');
                    break;
                case 'bold':
                    toggleClass(overlappingSpan, 'bold-text');
                    break;
            }
            // If span has no styles left, unwrap it
            if (!overlappingSpan.classList.length) {
                const parent = overlappingSpan.parentNode;
                while (overlappingSpan.firstChild) {
                    parent.insertBefore(overlappingSpan.firstChild, overlappingSpan);
                }
                parent.removeChild(overlappingSpan);
            }
        } else {
            // Only apply style to completely new selections
            const spanParent = range.commonAncestorContainer.parentElement;
            if (!spanParent.matches('.highlighted-text, .underlined-text, .bold-text')) {
                const span = document.createElement('span');
                switch(action) {
                    case 'highlight':
                        span.className = 'highlighted-text';
                        break;
                    case 'underline':
                        span.className = 'underlined-text';
                        break;
                    case 'bold':
                        span.className = 'bold-text';
                        break;
                }
                range.surroundContents(span);
            }
        }
        selection.removeAllRanges();
        removeSelectionIcons();
    }

    updateStudentInteractions(action, type, content);
}

function updateStudentInteractions(action, type, content) {
    // This function would handle storing or sending the interaction data
    // For now, we'll just log it to the console
    // eslint-disable-next-line no-console
    console.log(`Action: ${action}, Type: ${type}, Content: ${content}`);
    // In a real application, you might do something like:
    // sendToServer('/api/student-interactions', { action, content });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addIconsToParagraphs();
    setupTextSelection();
});