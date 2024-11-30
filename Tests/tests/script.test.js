import '@testing-library/jest-dom';

describe('Main Script', () => {
    beforeEach(() => {
        // Mock the handlers
        window.handleParagraphActions = {
            highlight: jest.fn(),
            question: jest.fn(),
            comment: jest.fn()
        };
        
        window.handleTextActions = {
            highlight: jest.fn(),
            underline: jest.fn(),
            bold: jest.fn()
        };
        
        // Mock console.log to test interaction logging
        console.log = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Icon Click Handler', () => {
        test('calls paragraph action handler for paragraph type', () => {
            const paragraph = document.createElement('p');
            window.handleIconClick('highlight', 'paragraph', paragraph);
            
            expect(window.handleParagraphActions.highlight).toHaveBeenCalledWith(paragraph);
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Action: highlight, Type: paragraph')
            );
        });

        test('calls text action handler for selection type', () => {
            const selection = window.getSelection();
            window.handleIconClick('bold', 'selection', selection);
            
            expect(window.handleTextActions.bold).toHaveBeenCalledWith(selection);
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Action: bold, Type: selection')
            );
        });

        test('handles unknown action types gracefully', () => {
            window.handleIconClick('invalid', 'unknown', {});
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Action: invalid, Type: unknown')
            );
        });
    });
});