export const Tags = [
    { label: 'Groceries', icon: '🛒', color: 'text-green-600' },
    { label: 'Shopping', icon: '🛍️', color: 'text-purple-600' },
    { label: 'Entertainment', icon: '🎬', color: 'text-blue-600' },
    { label: 'Utilities', icon: '💡', color: 'text-orange-600' },
    { label: 'Dining', icon: '🍽️', color: 'text-red-600' },
    { label: 'Health', icon: '⚕️', color: 'text-yellow-600' },
    { label: 'Transportation', icon: '🚗', color: 'text-indigo-600' },
    { label: 'Education', icon: '📚', color: 'text-green-600' },
    { label: 'Accomodation', icon: '🏨', color: 'text-purple-600' },
    { label: 'Travel', icon: '✈️', color: 'text-blue-600' },
    { label: 'Other', icon: '💬', color: 'text-gray-600' }
];

export const getTagColor = (label: string) => {
    const tag = Tags.find(t => t.label === label);
    return tag?.color || 'text-gray-600';
};