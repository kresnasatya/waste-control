export function capitalizeLetter(letter: String): String {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
}

export function getStatusClass(status: string): string {
    switch (status) {
        case 'next': return 'text-indicator-info';
        case 'anomaly': return 'text-indicator-error';
        case 'done': return 'text-indicator-done';
        case 'todo': return 'text-wwwaste-blue';
        default: return 'text-gray-800';
    }
}