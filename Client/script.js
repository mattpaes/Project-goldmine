// script.js
window.handleIconClick = function(action, type, content) {
    if (type === 'paragraph') {
        window.handleParagraphActions[action]?.(content);
    } else if (type === 'selection') {
        window.handleTextActions[action]?.(content);
    }
    
    updateStudentInteractions(action, type, content);
}

function updateStudentInteractions(action, type, content) {
    // This function would handle storing or sending the interaction data
    // For now, we'll just log it to the console
    // eslint-disable-next-line no-console
    console.log(`Action: ${action}, Type: ${type}, Content: ${content}`);
    // In a real application, you might do something like:
    // sendToServer('/api/student-interactions', { action, content });
}