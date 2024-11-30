require('@testing-library/jest-dom');

describe('Paragraph Interactions', () => {
    // Rest of the test file remains the same
    let container;

    beforeEach(() => {
        // Setup test DOM
        container = document.createElement('div');
        container.className = 'content';
        document.body.appendChild(container);
        
        // Create test paragraph
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Test paragraph';
        container.appendChild(paragraph);
        
        // Initialize the icons
        window.handleParagraphActions = {
            question: jest.fn(),
            highlight: jest.fn(),
            comment: jest.fn()
        };
        
        window.addIconsToParagraphs();
    });

    // ... rest of the tests
});