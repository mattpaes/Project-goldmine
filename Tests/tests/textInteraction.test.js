import '@testing-library/jest-dom';

// Setup window functions needed for tests
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

window.setupTextSelection = () => {
    const content = document.querySelector('.content');
    
    content.addEventListener('mouseup', function(event) {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 0) {
                window.showSelectionIcons(event.clientX, event.clientY);
            }
        }, 10);
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.selection-icons')) {
            const existingIcons = document.querySelector('.selection-icons');
            if (existingIcons) {
                existingIcons.remove();
            }
        }
    });
};

// Mock handleTextActions
window.handleTextActions = {
    highlight: jest.fn((selection) => {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'highlighted-text';
        range.surroundContents(span);
    }),
    underline: jest.fn(),
    bold: jest.fn((selection) => {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'bold-text';
        range.surroundContents(span);
    })
};

describe('Text Interactions', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.className = 'content';
        container.innerHTML = '<p>Test paragraph with selectable text</p>';
        document.body.appendChild(container);
        window.setupTextSelection();
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
            
            expect(container.querySelector('.highlighted-text')).toBeFalsy();
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
            window.handleTextActions.bold(selection);

            const styledText = container.querySelector('span');
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