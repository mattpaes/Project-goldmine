// script.js

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
                handleIconClick(action, index);
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

// ... rest of the JavaScript code ...

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    addIconsToParagraphs();
});



function handleIconClick(action, paragraphIndex) {
    console.log(`Icon clicked: ${action} for paragraph ${paragraphIndex}`);
    const paragraph = document.querySelectorAll('.content p')[paragraphIndex];
    
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
    
    // Here you could send this information to a server or store it locally
    updateStudentInteractions(action, paragraphIndex);
}

function toggleClass(element, className) {
    element.classList.toggle(className);
}

function updateStudentInteractions(action, paragraphIndex) {
    // This function would handle storing or sending the interaction data
    // For now, we'll just log it to the console
    console.log(`Action: ${action}, Paragraph: ${paragraphIndex}`);
    // In a real application, you might do something like:
    // sendToServer('/api/student-interactions', { action, paragraphIndex });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    addIconsToParagraphs();
});