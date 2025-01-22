// Client/paragraph-interactions.js

const handleParagraphActions = {
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

// Expose just what's needed for testing
window.handleParagraphActions = handleParagraphActions;

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
        indicator.onclick = () => handleParagraphActions.comment(paragraph);
        paragraph.appendChild(indicator);
    }
};

const removeCommentIndicator = (paragraph) => {
    paragraph.querySelector('.comment-indicator')?.remove();
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
        
        iconsContainer.querySelectorAll('i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                if (handleParagraphActions[action]) {
                    handleParagraphActions[action](paragraph);
                }
            });
        });
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', addIconsToParagraphs);