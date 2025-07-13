export function capitalizeLetter(letter: String): String {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
}

export function getStatusClass(status: string): string {
    switch (status) {
        case 'next': return 'text-indicator-info';
        case 'anomaly':
        case 'cancelled':
            return 'text-indicator-error';
        case 'done': return 'text-indicator-success';
        case 'todo': return 'text-wwwaste-blue';
        default: return 'text-gray-800';
    }
}