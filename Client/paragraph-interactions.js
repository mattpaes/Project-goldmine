// Paragraph actions handlers
window.handleParagraphActions = {
    question: (paragraph) => {
        paragraph.classList.toggle('questioned');
    },
    
    highlight: (paragraph) => {
        paragraph.classList.toggle('highlighted');
    },
    
    comment: (paragraph) => {
        removeExistingCommentBox();
        const commentBox = createCommentBox(paragraph);
        paragraph.appendChild(commentBox);
        paragraph.classList.add('commenting');
    }
};

const addHoverEffects = (paragraph, iconsContainer) => {
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
};

const addIconsToParagraphs = () => {
    const paragraphs = document.querySelectorAll('.content p');
    
    paragraphs.forEach(paragraph => {
        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'paragraph-icons';
        iconsContainer.innerHTML = `
            <i class="fas fa-question-circle" data-action="question" title="Ask a question"></i>
            <i class="fas fa-highlighter" data-action="highlight" title="Highlight"></i>
            <i class="fas fa-comment" data-action="comment" title="Add a comment"></i>
        `;
        paragraph.appendChild(iconsContainer);
        
        addHoverEffects(paragraph, iconsContainer);
        
        iconsContainer.querySelectorAll('i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                window.handleIconClick(action, 'paragraph', paragraph);
            });
        });
    });
};

// Comment box related functions
const removeExistingCommentBox = () => {
    const existingBox = document.querySelector('.comment-box');
    if (existingBox) {
        existingBox.remove();
        document.querySelector('.commenting')?.classList.remove('commenting');
    }
};

const createCommentBox = (paragraph) => {
    const box = document.createElement('div');
    box.className = 'comment-box';
    
    const textarea = document.createElement('textarea');
    textarea.className = 'comment-input';
    textarea.placeholder = 'Add your comment...';
    textarea.value = paragraph.dataset.comment || '';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'comment-buttons';
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => handleSave(paragraph, textarea.value);
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => handleCancel(paragraph);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);
    
    box.appendChild(textarea);
    box.appendChild(buttonContainer);
    
    setTimeout(() => textarea.focus(), 0);
    
    return box;
};

const handleSave = (paragraph, comment) => {
    if (comment.trim()) {
        paragraph.dataset.comment = comment;
        paragraph.classList.add('has-comment');
        addCommentIndicator(paragraph);
    } else {
        paragraph.removeAttribute('data-comment');
        paragraph.classList.remove('has-comment');
        removeCommentIndicator(paragraph);
    }
    cleanup(paragraph);
};

const handleCancel = (paragraph) => {
    cleanup(paragraph);
};

const cleanup = (paragraph) => {
    removeExistingCommentBox();
    paragraph.classList.remove('commenting');
};

const addCommentIndicator = (paragraph) => {
    const existingIndicator = paragraph.querySelector('.comment-indicator');
    if (!existingIndicator) {
        const indicator = document.createElement('div');
        indicator.className = 'comment-indicator';
        indicator.innerHTML = '<i class="fas fa-comment"></i>';
        indicator.onclick = () => window.handleParagraphActions.comment(paragraph);
        paragraph.appendChild(indicator);
    }
};

const removeCommentIndicator = (paragraph) => {
    paragraph.querySelector('.comment-indicator')?.remove();
};

// Initialize paragraphs
document.addEventListener('DOMContentLoaded', () => {
    addIconsToParagraphs();
    document.querySelectorAll('[data-comment]').forEach(paragraph => {
        addCommentIndicator(paragraph);
    });
});