const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const SKILL_LIST = [
  "vocab",
  "grammar",
  "phrases",
  "comprehension",
];

const QUESTION_BANK = {
    vocab: [
      {
        level: 1,
        prompt: 'Choose the synonym for "quick".',
        answers: ["fast", "rapid"],
        tip: "Quick and fast both mean done with speed. For example, 'a quick runner' is 'a fast runner'.",
        focus: "Synonyms",
        choices: ["fast", "slow", "late", "weak"],
      },
      {
        level: 1,
        prompt: 'Pick the word that means "small".',
        answers: ["tiny", "small"],
        tip: "Tiny is a stronger word for small. Think of an ant; it is tiny.",
        focus: "Adjectives",
        choices: ["tiny", "heavy", "loud", "empty"],
      },
      {
        level: 1,
        prompt: 'Choose the synonym for "happy".',
        answers: ["joyful", "cheerful"],
        tip: "Happy, joyful, and cheerful all describe a state of feeling or showing pleasure. 'A cheerful smile.'",
        focus: "Synonyms",
        choices: ["joyful", "sad", "angry", "tired"],
      },
      {
        level: 1,
        prompt: 'What is the opposite of "hot"?',
        answers: ["cold"],
        tip: "Opposites are called antonyms. The antonym of hot is cold. For example, 'a hot day' vs 'a cold day'.",
        focus: "Antonyms",
        choices: ["cold", "warm", "tepid", "frozen"],
      },
      {
        level: 2,
        prompt:
          "Fill in the blank: The lecture was so ___ that I could hardly stay awake.",
        answers: ["boring", "dull"],
        tip: "If you could hardly stay awake, the lecture was not interesting. 'Boring' or 'dull' fits best.",
        focus: "Context clues",
        choices: ["boring", "brave", "bright", "brief"],
      },
      {
        level: 2,
        prompt: 'What does "reliable" mean?',
        answers: ["dependable", "trustworthy"],
        tip: "A reliable person or thing can be trusted to work well. A reliable car is dependable.",
        focus: "Definitions",
        choices: ["dependable", "careless", "temporary", "nervous"],
      },
      {
        level: 2,
        prompt: 'What does "ancient" mean?',
        answers: ["very old", "extremely old"],
        tip: "Ancient refers to something from a very long time ago, like the ancient pyramids of Egypt.",
        focus: "Definitions",
        choices: ["very old", "brand new", "recently built", "modern"],
      },
      {
        level: 2,
        prompt: 'What does "annual" mean?',
        answers: ["yearly", "once a year"],
        tip: "An annual event happens once every year. For example, a birthday is an annual celebration.",
        focus: "Definitions",
        choices: ["yearly", "daily", "weekly", "monthly"],
      },
      {
        level: 3,
        prompt: "Choose the best word: The results were ___, so we celebrated.",
        answers: ["encouraging", "promising"],
        tip: "Celebration means the results were positive and gave hope for the future. 'Encouraging' is a good fit.",
        focus: "Positive adjectives",
        choices: ["encouraging", "confusing", "ordinary", "risky"],
      },
      {
        level: 3,
        prompt: 'Pick the synonym for "avoid".',
        answers: ["evade", "escape"],
        tip: "To avoid something is to stay away from it. 'Evade' has a similar meaning, often implying cleverness.",
        focus: "Synonyms",
        choices: ["evade", "accept", "allow", "announce"],
      },
      {
        level: 3,
        prompt: 'What is a "catastrophe"?',
        answers: ["a sudden and great disaster", "a disaster"],
        tip: "A catastrophe is a large-scale disaster, like an earthquake or a hurricane. The word implies a terrible event.",
        focus: "Definitions",
        choices: ["a sudden and great disaster", "a minor problem", "a happy event", "a celebration"],
      },
      {
        level: 3,
        prompt: 'Choose the synonym for "beautiful".',
        answers: ["gorgeous", "stunning", "exquisite"],
        tip: "'Gorgeous', 'stunning', and 'exquisite' are all strong synonyms for 'beautiful', often used to describe something breathtaking.",
        focus: "Synonyms",
        choices: ["gorgeous", "plain", "ugly", "average"],
      },
      {
        level: 4,
        prompt: "Fill in the blank: The manager was ___ about the deadline.",
        answers: ["strict", "firm"],
        tip: "A 'strict' or 'firm' manager is someone who enforces rules without compromise, especially for important things like deadlines.",
        focus: "Tone adjectives",
        choices: ["strict", "casual", "random", "silent"],
      },
      {
        level: 4,
        prompt:
          "Choose the best word: Her explanation was ___ and easy to follow.",
        answers: ["clear", "straightforward"],
        tip: "If an explanation is easy to follow, it is presented in a way that is simple to understand. 'Clear' and 'straightforward' both fit well.",
        focus: "Clarity adjectives",
        choices: ["clear", "fragile", "shallow", "messy"],
      },
      {
        level: 4,
        prompt: 'What is a synonym for "ubiquitous"?',
        answers: ["everywhere", "omnipresent"],
        tip: "Something that is ubiquitous seems to be everywhere at once. For example, smartphones are ubiquitous today.",
        focus: "Synonyms",
        choices: ["everywhere", "rare", "scarce", "limited"],
      },
      {
        level: 4,
        prompt: 'What does "ephemeral" mean?',
        answers: ["short-lived", "lasting for a very short time"],
        tip: "Something that is ephemeral lasts for a very short time. For example, the beauty of a flower is often described as ephemeral.",
        focus: "Definitions",
        choices: ["short-lived", "permanent", "eternal", "long-lasting"],
      },
    ],
  grammar: [
    {
      level: 1,
      prompt: "Choose the correct verb: She ___ to work every day.",
      answers: ["goes"],
      tip: "For the third-person singular (he, she, it) in the present simple tense, we add -s or -es to the verb. 'She goes.'",
      focus: "Present simple",
      choices: ["goes", "go", "going", "gone"],
    },
    {
      level: 1,
      prompt: "Fill in the blank: I ___ a student.",
      answers: ["am"],
      tip: "The verb 'to be' changes for each subject. For 'I', the present tense form is 'am'. 'I am', 'you are', 'he is'.",
      focus: "To be (present)",
      choices: ["am", "is", "are", "be"],
    },
    {
      level: 1,
      prompt: "Choose the correct pronoun: Please give the book to ___.",
      answers: ["him"],
      tip: "When a pronoun is the object of a verb or preposition, use the object form (me, you, him, her, it, us, them).",
      focus: "Pronouns",
      choices: ["he", "him", "his", "himself"],
    },
    {
      level: 1,
      prompt: "What is the plural of 'cat'?",
      answers: ["cats"],
      tip: "To make most nouns plural, we add -s at the end. One cat, two cats.",
      focus: "Plurals",
      choices: ["cats", "cates", "cat's", "catties"],
    },
    {
      level: 2,
      prompt: "Choose the correct article: I saw ___ elephant at the zoo.",
      answers: ["an"],
      tip: "Use 'an' before a word that starts with a vowel sound (a, e, i, o, u). 'Elephant' starts with an 'e' sound.",
      focus: "Articles",
      choices: ["a", "an", "the", "no article"],
    },
    {
      level: 2,
      prompt: "Fill in the blank: They ___ finished their homework.",
      answers: ["have"],
      tip: "The present perfect tense is formed with 'have' or 'has' plus the past participle. For 'they', we use 'have'.",
      focus: "Present perfect",
      choices: ["have", "has", "had", "having"],
    },
    {
      level: 2,
      prompt: "What is the past tense of 'go'?",
      answers: ["went"],
      tip: "'Go' is an irregular verb, so its past tense form, 'went', doesn't follow the usual -ed rule.",
      focus: "Irregular verbs",
      choices: ["went", "goed", "gone", "going"],
    },
    {
        level: 2,
        prompt: "My birthday is ___ October.",
        answers: ["in"],
        tip: "Use 'in' for months, years, and seasons. Use 'on' for specific days and dates.",
        focus: "Prepositions",
        choices: ["in", "on", "at", "by"],
    },
    {
      level: 3,
      prompt: "Choose the correct preposition: We arrived ___ the station.",
      answers: ["at"],
      tip: "Use 'at' for specific points or locations like 'at the station'. Use 'in' for larger areas like cities or countries ('in London').",
      focus: "Prepositions",
      choices: ["at", "in", "on", "to"],
    },
    {
      level: 3,
      prompt: "Complete the sentence: If I ___ time, I would travel more.",
      answers: ["had"],
      tip: "This is a second conditional sentence, used for hypothetical situations. The structure is 'if' + past simple, 'would' + base verb.",
      focus: "Second conditional",
      choices: ["have", "had", "will have", "am having"],
    },
    {
      level: 3,
      prompt: "Which is the comparative form of 'good'?",
      answers: ["better"],
      tip: "'Good' has an irregular comparative form, which is 'better'. The superlative form is 'best'.",
      focus: "Comparatives",
      choices: ["better", "gooder", "more good", "best"],
    },
    {
        level: 3,
        prompt: "That book is ___. I bought it yesterday.",
        answers: ["mine"],
        tip: "Possessive pronouns (mine, yours, his, hers, its, ours, theirs) show ownership and replace a noun. 'That book is my book' becomes 'That book is mine.'",
        focus: "Possessive Pronouns",
        choices: ["mine", "my", "me", "I"],
    },
    {
      level: 4,
      prompt: "Choose the correct tense: By 9 PM, she ___.",
      answers: ["had left"],
      tip: "The past perfect tense ('had left') is used to describe an action that was completed before another action or point in the past.",
      focus: "Past perfect",
      choices: ["had left", "left", "has left", "was leaving"],
    },
    {
      level: 4,
      prompt: "Select the correct form: There ___ many reasons.",
      answers: ["are"],
      tip: "Use 'are' with plural nouns ('many reasons'). Use 'is' with singular nouns ('one reason').",
      focus: "There is/are",
      choices: ["is", "are", "was", "be"],
    },
    {
      level: 4,
      prompt: "This is the person ___ I met yesterday.",
      answers: ["whom"],
      tip: "Use 'whom' when the person is the object of the verb. A simple trick: if you can replace it with 'him' or 'her', use 'whom'. 'I met him yesterday.'",
      focus: "Who vs Whom",
      choices: ["who", "whom", "whose", "which"],
    },
    {
        level: 4,
        prompt: "By this time next year, I ___ my degree.",
        answers: ["will have finished"],
        tip: "The future perfect tense ('will have' + past participle) describes an action that will be completed before a specific point in the future.",
        focus: "Future Perfect",
        choices: ["will have finished", "will finish", "am finishing", "finished"],
    },
  ],
  phrases: [
    {
      level: 1,
      prompt: "Complete the phrase: make a ___.",
      answers: ["decision"],
      tip: "We use 'make' with 'decision'. For example: 'I need to make a decision about my future.'",
      focus: "Collocations",
      choices: ["decision", "mistake", "homework", "party"],
    },
    {
      level: 1,
      prompt: "Choose the correct phrase: take a ___.",
      answers: ["break"],
      tip: "We 'take a break' when we stop working or studying to rest for a short time.",
      focus: "Collocations",
      choices: ["break", "decision", "home", "progress"],
    },
    {
      level: 1,
      prompt: "Complete the collocation: ___ a look.",
      answers: ["have"],
      tip: "'Have a look' is a common phrase that means to look at something. 'Can I have a look at your new phone?'",
      focus: "Collocations",
      choices: ["have", "do", "get", "see"],
    },
    {
      level: 2,
      prompt: "Fill in: I'm looking ___ to the weekend.",
      answers: ["forward"],
      tip: "'Look forward to' is a phrasal verb that means you are excited about something that is going to happen.",
      focus: "Phrasal verbs",
      choices: ["forward", "up", "out", "over"],
    },
    {
      level: 2,
      prompt: 'Phrase meaning: "call it a day" means ___.',
      answers: ["stop working", "finish for now"],
      tip: "This idiom is used to say that you have finished working for the day. 'It's late, let's call it a day.'",
      focus: "Idioms",
      choices: ["stop working", "start early", "work faster", "take notes"],
    },
    {
      level: 2,
      prompt: 'What does "break the ice" mean?',
      answers: ["to make people feel more comfortable", "to start a conversation"],
      tip: "This idiom means to do or say something to relieve tension or get conversation started in a social situation. 'He told a joke to break the ice.'",
      focus: "Idioms",
      choices: ["to make people feel more comfortable", "to end a relationship", "to get angry", "to be quiet"],
    },
    {
      level: 2,
      prompt: "I ___ along with my new colleagues.",
      answers: ["get"],
      tip: "The phrasal verb 'get along with someone' means to have a friendly relationship with them.",
      focus: "Phrasal verbs",
      choices: ["get", "go", "put", "take"],
    },
    {
      level: 3,
      prompt: "Complete: pay ___ to the instructions.",
      answers: ["attention"],
      tip: "The collocation 'pay attention' means to listen to, watch, or consider something or someone very carefully.",
      focus: "Collocations",
      choices: ["attention", "money", "care", "visit"],
    },
    {
      level: 3,
      prompt: "Use the phrasal verb: She ___ up smoking last year.",
      answers: ["gave"],
      tip: "The phrasal verb 'give up' means to quit or stop doing something, often a habit.",
      focus: "Phrasal verbs",
      choices: ["gave", "got", "took", "held"],
    },
    {
      level: 3,
      prompt: "Fill in the blank: We are starting to ___ out of milk.",
      answers: ["run"],
      tip: "The phrasal verb 'run out of' something means to use all of it so that there is none left.",
      focus: "Phrasal verbs",
      choices: ["run", "get", "go", "be"],
    },
    {
      level: 3,
      prompt: 'What does "once in a blue moon" mean?',
      answers: ["very rarely", "not often"],
      tip: "This idiom describes something that happens very infrequently. 'I only see my cousin from Australia once in a blue moon.'",
      focus: "Idioms",
      choices: ["very rarely", "very often", "all the time", "never"],
    },
    {
      level: 4,
      prompt: "Complete: in the ___ run, it will help.",
      answers: ["long"],
      tip: "The idiom 'in the long run' refers to a long period of time in the future. 'This decision will be good in the long run.'",
      focus: "Idioms",
      choices: ["long", "wide", "first", "fast"],
    },
    {
      level: 4,
      prompt: 'Meaning of "on the same page" is ___.',
      answers: ["in agreement", "agree", "aligned"],
      tip: "If people are 'on the same page', they have the same understanding or are in agreement about something.",
      focus: "Idioms",
      choices: ["in agreement", "lost", "confused", "delayed"],
    },
    {
      level: 4,
      prompt: 'What does it mean to "bite the bullet"?',
      answers: ["to face a difficult situation with courage"],
      tip: "This idiom means to decide to do something difficult or unpleasant that one has been putting off. 'He had to bite the bullet and tell his boss about the mistake.'",
      focus: "Idioms",
      choices: ["to face a difficult situation with courage", "to eat something quickly", "to go to the doctor", "to be very angry"],
    },
  ],
  comprehension: [
    {
      level: 1,
      prompt:
        "Liam missed the bus, so he arrived late. Why was Liam late?",
      answers: ["he missed the bus", "missed the bus"],
      tip: "The sentence explains the cause ('missed the bus') and the effect ('arrived late'). The question asks for the cause.",
      focus: "Cause and effect",
      choices: [
        "He missed the bus.",
        "He overslept.",
        "He forgot the time.",
        "He took a taxi.",
      ],
    },
    {
      level: 1,
      prompt:
        "Nina wore a jacket because it was cold. Why did Nina wear a jacket?",
      answers: ["it was cold", "because it was cold"],
      tip: "The word 'because' introduces the reason or cause for an action. Nina wore a jacket for the reason that it was cold.",
      focus: "Cause and effect",
      choices: [
        "It was cold.",
        "It was raining.",
        "It was windy.",
        "It was hot.",
      ],
    },
    {
      level: 1,
      prompt: "The dog is sleeping on the rug. What is the dog doing?",
      answers: ["sleeping", "sleeping on the rug"],
      tip: "The sentence directly states the action the dog is performing. Look for the verb.",
      focus: "Detail identification",
      choices: ["sleeping", "eating", "playing", "barking"],
    },
    {
      level: 2,
      prompt:
        "The meeting was postponed because the manager was sick. What happened to the meeting?",
      answers: ["it was postponed", "it was delayed"],
      tip: "'Postponed' means that something was arranged to take place at a later time than originally planned. It is similar to 'delayed'.",
      focus: "Word meaning",
      choices: [
        "It was postponed.",
        "It was canceled.",
        "It started early.",
        "It was moved online.",
      ],
    },
    {
      level: 2,
      prompt:
        "Maria is a talented musician who plays the piano and the violin. She practices every day. What is the main idea of this text?",
      answers: ["Maria is a dedicated musician.", "Maria is a talented and dedicated musician."],
      tip: "The main idea is the most important point of the text. The text describes her talent (plays two instruments) and dedication (practices daily).",
      focus: "Main idea",
      choices: [
        "Maria is a dedicated musician.",
        "Maria only plays the piano.",
        "Maria dislikes practicing.",
        "Maria is a beginner.",
      ],
    },
    {
        level: 2,
        prompt: "Tomatoes, although often considered a vegetable, are technically a fruit. They grow on a vine and contain seeds. Where do tomatoes grow?",
        answers: ["on a vine"],
        tip: "Read the passage carefully to find the specific detail that answers the question. The text explicitly states 'They grow on a vine'.",
        focus: "Detail identification",
        choices: ["on a vine", "underground", "on a tree", "in a bush"],
    },
    {
      level: 3,
      prompt:
        "After months of training, Luis finally ran the marathon. How long did Luis train?",
      answers: ["months", "for months"],
      tip: "The phrase 'After months of training' directly tells us the duration of his training period.",
      focus: "Time details",
      choices: ["Months.", "Weeks.", "One day.", "Two years."],
    },
    {
      level: 3,
      prompt: "The report was concise but thorough. What best describes the report?",
      answers: ["brief and complete", "short but complete", "concise and thorough"],
      tip: "'Concise' means giving a lot of information clearly and in a few words. 'Thorough' means complete with regard to every detail.",
      focus: "Paraphrase",
      choices: [
        "Brief and complete.",
        "Long and detailed.",
        "Unclear and messy.",
        "Fast and early.",
      ],
    },
    {
      level: 3,
      prompt: "Even though it was expensive, Sarah bought the ticket. What can you infer about the event?",
      answers: ["The event was important to Sarah.", "Sarah really wanted to go."],
      tip: "Inferring means figuring something out that is not explicitly stated. Since she bought an expensive ticket, we can infer the event was very important to her.",
      focus: "Inference",
      choices: [
        "The event was important to Sarah.",
        "The event was cheap.",
        "Sarah had a lot of money.",
        "The event was not popular.",
      ],
    },
    {
      level: 4,
      prompt:
        "Maya reread the instructions to avoid mistakes. What was Maya trying to avoid?",
      answers: ["mistakes"],
      tip: "The sentence explicitly states her purpose: 'to avoid mistakes'. This was her primary goal.",
      focus: "Main idea",
      choices: ["Mistakes.", "Delays.", "Changes.", "Rules."],
    },
    {
      level: 4,
      prompt:
        "The street was was flooded, so they took a longer route. Why did they take a longer route?",
      answers: ["the street was flooded", "because the street was flooded"],
      tip: "This is another example of cause and effect. The flooded street (cause) forced them to take a different, longer route (effect).",
      focus: "Cause and effect",
      choices: [
        "The street was flooded.",
        "They were lost.",
        "They wanted a tour.",
        "The bus was late.",
      ],
    },
    {
      level: 4,
      prompt: "Our city's recycling program has been a resounding success. Last year alone, we diverted over 10,000 tons of waste from landfills, saving taxpayer money and protecting the environment. We urge all citizens to continue their efforts. What is the author's primary purpose?",
      answers: ["to persuade people to recycle"],
      tip: "Consider the overall message. The author praises the program and encourages people ('urges all citizens') to continue, which indicates a persuasive intent.",
      focus: "Author's purpose",
      choices: [
        "To persuade people to recycle",
        "To inform people about landfills",
        "To complain about taxes",
        "To entertain with a story",
      ],
    },
  ],
};

async function setup() {
  console.log('Opening the database...');
  // make sure to use sqlite.verbose() to get more verbose error messages
  const db = await open({
    filename: './questions.db',
    driver: sqlite3.verbose().Database
  });

  console.log('Migrating the schema...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      skill TEXT NOT NULL,
      level INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      answers TEXT NOT NULL,
      tip TEXT,
      focus TEXT,
      choices TEXT
    );
  `);

  // Clear the table before inserting to avoid duplicates on re-running
  console.log('Clearing existing questions...');
  await db.exec('DELETE FROM questions');

  console.log('Inserting questions...');
  const insertStmt = await db.prepare(
    'INSERT INTO questions (skill, level, prompt, answers, tip, focus, choices) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  for (const skill of SKILL_LIST) {
    const questions = QUESTION_BANK[skill];
    for (const q of questions) {
      await insertStmt.run(
        skill,
        q.level,
        q.prompt,
        JSON.stringify(q.answers),
        q.tip,
        q.focus,
        JSON.stringify(q.choices || [])
      );
    }
  }

  await insertStmt.finalize();

  const count = await db.get('SELECT COUNT(*) as count FROM questions');
  console.log(`Database setup complete. ${count.count} questions inserted.`);

  await db.close();
}

setup().catch(err => {
  console.error('Error during database setup:', err);
  process.exit(1);
});
