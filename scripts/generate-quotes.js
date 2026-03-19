/**
 * Generates assets/quotes.json with 1000 quotes (20 handcrafted + templated).
 * Run: node scripts/generate-quotes.js
 */
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'Success',
  'Discipline',
  'Life',
  'Mindset',
  'Growth',
  'Focus',
  'Resilience',
  'Leadership',
];

const HANDCRAFTED = [
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Success',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'Resilience',
  },
  {
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
    category: 'Discipline',
  },
  {
    text: 'Your time is limited, so don’t waste it living someone else’s life.',
    author: 'Steve Jobs',
    category: 'Life',
  },
  {
    text: 'Whether you think you can or you think you can’t, you’re right.',
    author: 'Henry Ford',
    category: 'Mindset',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'Growth',
  },
  {
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: 'Discipline',
  },
  {
    text: 'Everything you’ve ever wanted is on the other side of fear.',
    author: 'George Addair',
    category: 'Mindset',
  },
  {
    text: 'Believe you can and you’re halfway there.',
    author: 'Theodore Roosevelt',
    category: 'Success',
  },
  {
    text: 'I have not failed. I’ve just found 10,000 ways that won’t work.',
    author: 'Thomas Edison',
    category: 'Resilience',
  },
  {
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
    category: 'Life',
  },
  {
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    category: 'Mindset',
  },
  {
    text: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
    category: 'Focus',
  },
  {
    text: 'Don’t watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
    category: 'Discipline',
  },
  {
    text: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    category: 'Growth',
  },
  {
    text: 'Act as if what you do makes a difference. It does.',
    author: 'William James',
    category: 'Leadership',
  },
  {
    text: 'Quality is not an act, it is a habit.',
    author: 'Aristotle',
    category: 'Discipline',
  },
  {
    text: 'He who has a why to live can bear almost any how.',
    author: 'Friedrich Nietzsche',
    category: 'Life',
  },
  {
    text: 'Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day saying, “I will try again tomorrow.”',
    author: 'Mary Anne Radmacher',
    category: 'Resilience',
  },
  {
    text: 'You miss 100% of the shots you don’t take.',
    author: 'Wayne Gretzky',
    category: 'Focus',
  },
];

const PREFIXES = [
  'Today, remember:',
  'Keep in mind:',
  'A gentle reminder:',
  'Your daily nudge:',
  'Stay inspired:',
  'Small step forward:',
  'Momentum matters:',
  'Choose growth:',
  'Lead with intention:',
  'Quiet strength says:',
];

const CORES = [
  'progress beats perfection when you show up daily.',
  'discipline is choosing what you want most over what you want now.',
  'clarity comes from action, not overthinking.',
  'consistency turns ordinary effort into extraordinary results.',
  'your habits are casting a vote for the person you are becoming.',
  'focus is a gift you give your future self.',
  'kindness to yourself fuels sustainable ambition.',
  'courage is repeating the attempt with a calmer mind.',
  'one honest hour of work can change the tone of your week.',
  'rest is part of the strategy, not a reward you must earn.',
  'boundaries protect your energy for what matters.',
  'curiosity dissolves fear faster than force.',
  'you grow where you choose to stay accountable.',
  'small wins stack into undeniable proof.',
  'your standards quietly shape your trajectory.',
];

const AUTHORS = [
  'Daily Motivation',
  'Anonymous',
  'Modern Wisdom',
  'Coach’s Note',
  'Inner Voice',
  'Quiet Mentor',
];

const TARGET = 1000;
const quotes = [];

let id = 1;
for (const h of HANDCRAFTED) {
  quotes.push({
    id: id++,
    text: h.text,
    author: h.author,
    category: h.category,
  });
}

while (quotes.length < TARGET) {
  const prefix = PREFIXES[quotes.length % PREFIXES.length];
  const core = CORES[quotes.length % CORES.length];
  const category = CATEGORIES[quotes.length % CATEGORIES.length];
  const author = AUTHORS[quotes.length % AUTHORS.length];
  quotes.push({
    id: id++,
    text: `${prefix} ${core.charAt(0).toUpperCase()}${core.slice(1)}`,
    author,
    category,
  });
}

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'quotes.json');
fs.writeFileSync(outFile, JSON.stringify({ quotes }, null, 2), 'utf8');
console.log(`Wrote ${quotes.length} quotes to ${outFile}`);
