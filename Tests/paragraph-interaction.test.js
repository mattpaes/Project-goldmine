// Tests/paragraphInteraction.test.js
import '@testing-library/jest-dom';
import '../Client/paragraph-interactions.js';

describe('Paragraph Interactions', () => {
    let container;
    let paragraph;

    beforeEach(() => {
        // Setup test DOM
        container = document.createElement('div');
        container.className = 'content';
        document.body.appendChild(container);
        
        // Create test paragraph
        paragraph = document.createElement('p');
        paragraph.textContent = 'Test paragraph';
        container.appendChild(paragraph);
        
        // Initialize icons
        window.addIconsToParagraphs();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Icon Management', () => {
        test('adds icons container to paragraph', () => {
            const iconsContainer = paragraph.querySelector('.paragraph-icons');
            expect(iconsContainer).toBeTruthy();
            expect(iconsContainer.querySelectorAll('i')).toHaveLength(3);
        });

        test('shows/hides icons on hover', () => {
            const iconsContainer = paragraph.querySelector('.paragraph-icons');
            paragraph.dispatchEvent(new MouseEvent('mouseenter'));
            expect(paragraph).toHaveClass('highlight');
            expect(iconsContainer.style.opacity).toBe('1');

            paragraph.dispatchEvent(new MouseEvent('mouseleave'));
            expect(paragraph).not.toHaveClass('highlight');
            expect(iconsContainer.style.opacity).toBe('0');
        });
    });

    describe('Multiple Paragraphs', () => {
        test('handles multiple paragraphs', () => {
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = 'Second paragraph';
            container.appendChild(paragraph2);
            
            window.addIconsToParagraphs();
            
            const paragraphs = container.querySelectorAll('p');
            expect(paragraphs).toHaveLength(2);
            paragraphs.forEach(p => {
                expect(p.querySelector('.paragraph-icons')).toBeTruthy();
            });
        });
    });

    describe('Paragraph Actions', () => {
        test('toggles question state', () => {
            window.handleParagraphActions.question(paragraph);
            expect(paragraph).toHaveClass('questioned');

            window.handleParagraphActions.question(paragraph);
            expect(paragraph).not.toHaveClass('questioned');
        });

        test('toggles highlight state', () => {
            window.handleParagraphActions.highlight(paragraph);
            expect(paragraph).toHaveClass('highlighted');

            window.handleParagraphActions.highlight(paragraph);
            expect(paragraph).not.toHaveClass('highlighted');
        });

        test('handles comment action', () => {
            window.handleParagraphActions.comment(paragraph);
            const commentBox = paragraph.querySelector('.comment-box');
            expect(commentBox).toBeTruthy();
            expect(paragraph).toHaveClass('commenting');
        });
    });

    describe('Comment Box Management', () => {
        test('removes existing comment box when creating new one', () => {
            const paragraph2 = document.createElement('p');
            container.appendChild(paragraph2);
            
            window.handleParagraphActions.comment(paragraph);
            expect(document.querySelectorAll('.comment-box')).toHaveLength(1);
            
            window.handleParagraphActions.comment(paragraph2);
            expect(document.querySelectorAll('.comment-box')).toHaveLength(1);
            expect(paragraph.querySelector('.comment-box')).toBeFalsy();
            expect(paragraph2.querySelector('.comment-box')).toBeTruthy();
        });
    });

    describe('Comment Management', () => {
        test('saves comment and adds indicator', () => {
            window.handleParagraphActions.comment(paragraph);
            const textarea = paragraph.querySelector('.comment-input');
            const saveButton = paragraph.querySelector('.comment-buttons button:last-child');
            
            textarea.value = 'Test comment';
            saveButton.click();

            expect(paragraph).toHaveClass('has-comment');
            expect(paragraph.dataset.comment).toBe('Test comment');
            expect(paragraph.querySelector('.comment-indicator')).toBeTruthy();
        });

        test('removes comment box on cancel', () => {
            window.handleParagraphActions.comment(paragraph);
            const cancelButton = paragraph.querySelector('.comment-buttons button:first-child');
            
            cancelButton.click();
            
            expect(paragraph.querySelector('.comment-box')).toBeFalsy();
            expect(paragraph).not.toHaveClass('commenting');
        });

        test('removes empty comments', () => {
            window.handleParagraphActions.comment(paragraph);
            const textarea = paragraph.querySelector('.comment-input');
            const saveButton = paragraph.querySelector('.comment-buttons button:last-child');
            
            textarea.value = '';
            saveButton.click();

            expect(paragraph).not.toHaveClass('has-comment');
            expect(paragraph.dataset.comment).toBeFalsy();
            expect(paragraph.querySelector('.comment-indicator')).toBeFalsy();
        });
    });

    describe('Hover Effects', () => {
        test('handles nested hover events', () => {
            const iconsContainer = paragraph.querySelector('.paragraph-icons');
            const hoverArea = paragraph.querySelector('.hover-area');
            
            // Test hover area enter
            hoverArea.dispatchEvent(new MouseEvent('mouseenter'));
            expect(paragraph).toHaveClass('highlight');
            expect(iconsContainer.style.opacity).toBe('1');
            
            // Test icons container enter while hover area active
            iconsContainer.dispatchEvent(new MouseEvent('mouseenter'));
            expect(paragraph).toHaveClass('highlight');
            expect(iconsContainer.style.opacity).toBe('1');
            
            // Test hover area leave to icons
            hoverArea.dispatchEvent(new MouseEvent('mouseleave', {
                relatedTarget: iconsContainer
            }));
            expect(paragraph).toHaveClass('highlight');
            expect(iconsContainer.style.opacity).toBe('1');
            
            // Test final leave
            iconsContainer.dispatchEvent(new MouseEvent('mouseleave', {
                relatedTarget: document.body
            }));
            expect(paragraph).not.toHaveClass('highlight');
            expect(iconsContainer.style.opacity).toBe('0');
        });
    });
});