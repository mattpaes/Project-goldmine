// script.js

function addIconsToParagraphs() {
    const paragraphs = document.querySelectorAll('.content p');
    paragraphs.forEach(paragraph => {
        if (!paragraph.querySelector('.paragraph-icons')) {
            const iconsSpan = document.createElement('span');
            iconsSpan.className = 'paragraph-icons';
            iconsSpan.innerHTML = `
                <i class="fas fa-question-circle"></i>
                <i class="fas fa-highlighter"></i>
                <i class="fas fa-comment"></i>
            `;
            paragraph.insertBefore(iconsSpan, paragraph.firstChild);
        }
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', addIconsToParagraphs);