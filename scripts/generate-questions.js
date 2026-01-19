
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const TOTAL_QUESTIONS = 1020;
const OUTPUT_FILE = path.join(__dirname, '../src/lib/questions.json');
const CATEGORIES = ["Vocabulary", "Grammar"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// --- Word Lists ---
const articles = { "a": "an", "an": "a" };
const verbs = {
    present: ["go", "see", "eat", "take", "make", "know", "think", "come", "want", "use"],
    past: ["went", "saw", "ate", "took", "made", "knew", "thought", "came", "wanted", "used"],
    participle: ["gone", "seen", "eaten", "taken", "made", "known", "thought", "come", "wanted", "used"]
};
const nouns = ["apple", "car", "house", "book", "computer", "world", "friend", "job", "life", "time", "day", "way"];
const adjectives = ["big", "small", "good", "bad", "new", "old", "high", "low", "different", "important"];
const prepositions = ["on", "in", "at", "for", "to", "from", "with", "about", "by"];

// --- Utility Functions ---
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getWrongOptions(correctAnswer, sourceArray, count = 3) {
    const options = new Set();
    while (options.size < count) {
        const option = getRandomElement(sourceArray);
        if (option !== correctAnswer) {
            options.add(option);
        }
    }
    return Array.from(options);
}

// --- Question Template Generators ---

// Template 1: Past tense of a verb
function generatePastTenseQuestion() {
    const index = Math.floor(Math.random() * verbs.present.length);
    const present = verbs.present[index];
    const past = verbs.past[index];

    const wrongOptions = getWrongOptions(past, [...verbs.past, `${present}ed`, present]);

    const options = shuffleArray([past, ...wrongOptions]);
    const correct_answer_index = options.indexOf(past);

    return {
        category: "Grammar",
        difficulty: "Beginner",
        question_text: `What is the past tense of the verb "${present}"?`,
        options,
        correct_answer_index
    };
}

// Template 2: Choose the correct preposition
function generatePrepositionQuestion() {
    const noun = getRandomElement(nouns);
    const correctPrep = getRandomElement(prepositions);
    const wrongOptions = getWrongOptions(correctPrep, prepositions);

    const options = shuffleArray([correctPrep, ...wrongOptions]);
    const correct_answer_index = options.indexOf(correctPrep);

    return {
        category: "Grammar",
        difficulty: "Intermediate",
        question_text: `The book is ___ the table. He put it there.`,
        options,
        correct_answer_index
    };
}

// Template 3: Antonym of an adjective
function generateAntonymQuestion() {
    const index = Math.floor(Math.random() * (adjectives.length / 2)) * 2;
    const adj1 = adjectives[index];
    const adj2 = adjectives[index + 1]; // Assumes pairs of antonyms

    const wrongOptions = getWrongOptions(adj2, adjectives);
    const options = shuffleArray([adj2, ...wrongOptions]);
    const correct_answer_index = options.indexOf(adj2);

    return {
        category: "Vocabulary",
        difficulty: "Beginner",
        question_text: `Which word is the opposite of "${adj1}"?`,
        options,
        correct_answer_index
    };
}

// Template 4: Correct article 'a' or 'an'
function generateArticleQuestion() {
    const noun = getRandomElement(nouns);
    const correctArticle = ['a', 'e', 'i', 'o', 'u'].includes(noun[0]) ? 'an' : 'a';
    const wrongArticle = articles[correctArticle];

    const options = shuffleArray([correctArticle, wrongArticle]);
    const correct_answer_index = options.indexOf(correctArticle);

    return {
        category: "Grammar",
        difficulty: "Beginner",
        question_text: `I saw ___ ${noun} today.`,
        options,
        correct_answer_index
    };
}


// --- Main Generation Logic ---
const questionGenerators = [
    generatePastTenseQuestion,
    generatePrepositionQuestion,
    generateAntonymQuestion,
    generateArticleQuestion
];

const questions = [];
for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const generator = getRandomElement(questionGenerators);
    const question = generator();
    question.id = i + 1; // Not strictly needed for JSON, but good practice
    
    // Randomize difficulty for more variety
    question.difficulty = getRandomElement(DIFFICULTIES);

    questions.push(question);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2));

console.log(`Successfully generated ${TOTAL_QUESTIONS} questions in ${OUTPUT_FILE}`);

