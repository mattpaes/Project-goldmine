// script.js

// The bellow functions make a set of icon appear on the right hand side of any paragraph within <<main>>
// when the mouse is hovering on the right hand side padding. When clicking on one of the icons, there is an 
// update in the styling to keep track of the interaction
// at a later stage, these interactions will be shared on the cloud so that they will be all centralized
// on the teacher screen
function addIconsToParagraphs() {
    console.log('addIconsToParagraphs function called');
    const paragraphs = document.querySelectorAll('.content p');
    console.log(`Found ${paragraphs.length} paragraphs`);
    
    paragraphs.forEach((paragraph, index) => {
        console.log(`Processing paragraph ${index + 1}`);
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
                handleIconClick(action,'paragraph', index);
            });
        });
    });
}

function addHoverEffects(paragraph, iconsContainer) {
    console.log('addHoverEffects function called for a paragraph');
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
// the bellow functions make a set of icons appear when selecting a block of text. Two interactions are allowed : highlighting and/or
// adding a note. This information will stay saved on the students' session and will not be shared to the teacher

//let currentSelection = null;

function setupTextSelection() {
    const content = document.querySelector('.content');
    
    content.addEventListener('mouseup', function(event) {
        // Remove any existing selection icons
        // Short delay to ensure the selection is complete (added as icons were not appearing without it)
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            // Remove any existing selection icons
            removeSelectionIcons();
            
            if (selectedText.length > 0) {
                //currentSelection = selection;            
                showSelectionIcons(event.clientX, event.clientY, selectedText);
            }else{
                //currentSelection=null;
            }
        }, 10);
    });

    // Click event listener to remove icons when clicking outside
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
        <i class="fas fa-highlighter" title="Highlight" data-action="highlight"</i>
        <i class="fas fa-comment" title="Add note"</i>
    `;

    // Position the icons at the mouse position, relative to the viewport and the document
    icons.style.position = 'absolute';
    icons.style.left = `${mouseX + window.scrollX + 10}px`;
    icons.style.top = `${mouseY + window.scrollY}px`; // 40px below the mouse

    // Add click event listeners to icons
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

function addNoteToSelection(selectedText) {
    console.log('Adding note to:', selectedText);
    // Implement note-adding logic here
}

/*function getCurrentSelectionSpan() {
    if (currentSelection && !currentSelection.isCollapsed) {
        const range = currentSelection.getRangeAt(0);
        let span = range.commonAncestorContainer;
        
        // If the selection is not already wrapped in a span, wrap it
        if (span.nodeType !== Node.ELEMENT_NODE || span.tagName !== 'SPAN') {
            span = document.createElement('span');
            span.textContent = range.toString();
            range.deleteContents();
            range.insertNode(span);
        }
        
        return span;
    }
    return null;
}*/

/*-------------------------------------------------------------------------------------------------------------------------*/
// The bellow functions are called to handle the features above

function handleIconClick(action, type, content) {
    if (type === 'paragraph') {
        const paragraph = document.querySelectorAll('.content p')[content]; // content is paragraphIndex
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
        const selection = document.querySelector(`span[data-selection="${content}"]`);
        switch(action) {
            case 'highlight':
                toggleClass(selection, 'highlighted');
                break;
            case 'note':
                addNoteToSelection(content); // content is selectedText
                break;
        }
    }

    updateStudentInteractions(action,type,content);
}

function updateStudentInteractions(action, type, paragraphIndex) {
    // This function would handle storing or sending the interaction data
    // For now, we'll just log it to the console
    console.log(`Action: ${action}, Type: ${type}, Paragraph: ${paragraphIndex}`);
    // In a real application, you might do something like:
    // sendToServer('/api/student-interactions', { action, paragraphIndex });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    addIconsToParagraphs();
    setupTextSelection();
    console.log('Text selection setup complete');
});