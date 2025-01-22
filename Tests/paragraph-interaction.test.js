// tests/text-interaction.test.js
import '@testing-library/jest-dom';
import '../Client/text-interactions.js';

describe('Text Interactions', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.className = 'content';
        container.innerHTML = '<p>Test paragraph with selectable text</p>';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Selection Toolbar', () => {
        test('shows selection toolbar on text selection', () => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(container.querySelector('p'));
            selection.removeAllRanges();
            selection.addRange(range);

            container.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
                clientX: 100,
                clientY: 100
            }));

            setTimeout(() => {
                const toolbar = document.querySelector('.selection-icons');
                expect(toolbar).toBeTruthy();
                expect(toolbar.querySelectorAll('i')).toHaveLength(3);
            }, 20);
        });

        test('removes toolbar when clicking outside', () => {
            window.showSelectionIcons(100, 100);
            document.body.click();
            expect(document.querySelector('.selection-icons')).toBeFalsy();
        });
    });

    describe('Text Styling', () => {
        test('applies highlight style to selected text', () => {
            const range = document.createRange();
            const p = container.querySelector('p');
            range.setStart(p.firstChild, 0);
            range.setEnd(p.firstChild, 4);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            window.handleTextActions.highlight(selection);
            
            const highlightedSpan = container.querySelector('.highlighted-text');
            expect(highlightedSpan).toBeTruthy();
            expect(highlightedSpan.textContent).toBe('Test');
        });

        test('toggles existing style when reapplying', () => {
            const p = container.querySelector('p');
            const span = document.createElement('span');
            span.className = 'highlighted-text';
            span.textContent = 'Test';
            p.insertBefore(span, p.firstChild);

            const range = document.createRange();
            range.selectNodeContents(span);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            window.handleTextActions.highlight(selection);
            expect(p.querySelector('.highlighted-text')).toBeFalsy();
            expect(p.textContent.startsWith('Test')).toBeTruthy();
        });

        test('applies multiple styles to same text', () => {
            const range = document.createRange();
            const p = container.querySelector('p');
            range.setStart(p.firstChild, 0);
            range.setEnd(p.firstChild, 4);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            window.handleTextActions.highlight(selection);
            const newSelection = window.getSelection();
            const newRange = document.createRange();
            const highlightedSpan = p.querySelector('.highlighted-text');
            newRange.selectNodeContents(highlightedSpan);
            newSelection.removeAllRanges();
            newSelection.addRange(newRange);
            window.handleTextActions.bold(newSelection);

            const styledText = p.querySelector('span');
            expect(styledText).toHaveClass('highlighted-text', 'bold-text');
        });
    });

    describe('Style Management', () => {
        test('removes span when all styles are toggled off', () => {
            const p = container.querySelector('p');
            const span = document.createElement('span');
            span.className = 'highlighted-text';
            span.textContent = 'Test';
            p.insertBefore(span, p.firstChild);

            window.toggleExistingStyle(span, 'highlighted-text');
            
            expect(p.querySelector('span')).toBeFalsy();
            expect(p.textContent.startsWith('Test')).toBeTruthy();
        });

        test('preserves other styles when removing one style', () => {
            const p = container.querySelector('p');
            const span = document.createElement('span');
            span.className = 'highlighted-text bold-text';
            span.textContent = 'Test';
            p.insertBefore(span, p.firstChild);

            window.toggleExistingStyle(span, 'highlighted-text');
            
            expect(p.querySelector('span')).toHaveClass('bold-text');
            expect(p.querySelector('span')).not.toHaveClass('highlighted-text');
        });
    });
});