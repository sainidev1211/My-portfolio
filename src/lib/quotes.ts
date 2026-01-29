export const QUOTES = [
    "Code is like humor. When you have to explain it, it’s bad. – Cory House",
    "First, solve the problem. Then, write the code. – John Johnson",
    "Experience is the name everyone gives to their mistakes. – Oscar Wilde",
    "In order to be irreplaceable, one must always be different. – Coco Chanel",
    "Knowledge is power. – Francis Bacon",
    "Simplicity is the soul of efficiency. – Austin Freeman",
    "Fix the cause, not the symptom. – Steve Maguire",
    "Make it work, make it right, make it fast. – Kent Beck"
];

export const getRandomQuote = () => {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
};
