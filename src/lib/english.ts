export type EnglishSkillKey = "vocab" | "grammar" | "phrases" | "comprehension";
export type Mode = EnglishSkillKey | "mix" | "review";

export interface Result {
  correct: boolean;
  ms: number;
}

export interface SkillStats {
  level: number;
  streak: number;
  mistakeStreak: number;
  history: Result[];
}

export type Stats = Record<EnglishSkillKey, SkillStats>;

export interface EnglishQuestion {
  id: string;
  bankId: string;
  prompt: string;
  answers: string[];
  tip: string;
  skill: EnglishSkillKey;
  level: number;
  focus: string;
  choices?: string[];
}

interface QuestionSpec {
  prompt: string;
  answers: string[];
  tip: string;
  focus: string;
  level: number;
  choices?: string[];
}

const MAX_HISTORY = 12;
export const MAX_LEVEL = 8;

const SKILL_LIST: EnglishSkillKey[] = [
  "vocab",
  "grammar",
  "phrases",
  "comprehension",
];

export const SKILL_LABELS: Record<EnglishSkillKey, string> = {
  vocab: "Vocabulary",
  grammar: "Grammar",
  phrases: "Phrases",
  comprehension: "Reading",
};

export const SKILL_SYMBOLS: Record<EnglishSkillKey, string> = {
  vocab: "V",
  grammar: "G",
  phrases: "P",
  comprehension: "R",
};

const QUESTION_BANK: Record<EnglishSkillKey, QuestionSpec[]> = {
  vocab: [
    {
      level: 1,
      prompt: 'Choose the synonym for "quick".',
      answers: ["fast", "rapid"],
      tip: "Quick and fast both mean done with speed.",
      focus: "Synonyms",
      choices: ["fast", "slow", "late", "weak"],
    },
    {
      level: 1,
      prompt: 'Pick the word that means "small".',
      answers: ["tiny", "small"],
      tip: "Think of something very small in size.",
      focus: "Adjectives",
      choices: ["tiny", "heavy", "loud", "empty"],
    },
    {
      level: 2,
      prompt:
        "Fill in the blank: The lecture was so ___ that I could hardly stay awake.",
      answers: ["boring", "dull"],
      tip: "If you could hardly stay awake, the lecture was not interesting.",
      focus: "Context clues",
      choices: ["boring", "brave", "bright", "brief"],
    },
    {
      level: 2,
      prompt: 'What does "reliable" mean?',
      answers: ["dependable", "trustworthy"],
      tip: "A reliable person or thing can be trusted.",
      focus: "Definitions",
      choices: ["dependable", "careless", "temporary", "nervous"],
    },
    {
      level: 3,
      prompt: "Choose the best word: The results were ___, so we celebrated.",
      answers: ["encouraging", "promising"],
      tip: "Celebration means the results were positive.",
      focus: "Positive adjectives",
      choices: ["encouraging", "confusing", "ordinary", "risky"],
    },
    {
      level: 3,
      prompt: 'Pick the synonym for "avoid".',
      answers: ["evade", "escape"],
      tip: "Avoid means to stay away from something.",
      focus: "Synonyms",
      choices: ["evade", "accept", "allow", "announce"],
    },
    {
      level: 4,
      prompt: "Fill in the blank: The manager was ___ about the deadline.",
      answers: ["strict", "firm"],
      tip: "Strict means not flexible and serious about rules.",
      focus: "Tone adjectives",
      choices: ["strict", "casual", "random", "silent"],
    },
    {
      level: 4,
      prompt:
        "Choose the best word: Her explanation was ___ and easy to follow.",
      answers: ["clear", "straightforward"],
      tip: "Easy to follow means clear or straightforward.",
      focus: "Clarity adjectives",
      choices: ["clear", "fragile", "shallow", "messy"],
    },
  ],
  grammar: [
    {
      level: 1,
      prompt: "Choose the correct verb: She ___ to work every day.",
      answers: ["goes"],
      tip: "Use -s for third-person singular in the present simple.",
      focus: "Present simple",
      choices: ["goes", "go", "going", "gone"],
    },
    {
      level: 1,
      prompt: "Fill in the blank: I ___ a student.",
      answers: ["am"],
      tip: "Use am with I in the present tense.",
      focus: "To be (present)",
      choices: ["am", "is", "are", "be"],
    },
    {
      level: 2,
      prompt: "Choose the correct article: I saw ___ elephant at the zoo.",
      answers: ["an"],
      tip: "Use an before vowel sounds like e in elephant.",
      focus: "Articles",
      choices: ["a", "an", "the", "no article"],
    },
    {
      level: 2,
      prompt: "Fill in the blank: They ___ finished their homework.",
      answers: ["have"],
      tip: "Present perfect uses have or has plus the past participle.",
      focus: "Present perfect",
      choices: ["have", "has", "had", "having"],
    },
    {
      level: 3,
      prompt: "Choose the correct preposition: We arrived ___ the station.",
      answers: ["at"],
      tip: "Arrive at small places, arrive in cities or countries.",
      focus: "Prepositions",
      choices: ["at", "in", "on", "to"],
    },
    {
      level: 3,
      prompt: "Complete the sentence: If I ___ time, I would travel more.",
      answers: ["had"],
      tip: "Second conditional uses past simple after if.",
      focus: "Second conditional",
      choices: ["have", "had", "will have", "am having"],
    },
    {
      level: 4,
      prompt: "Choose the correct tense: By 9 PM, she ___.",
      answers: ["had left"],
      tip: "Past perfect shows an earlier action in the past.",
      focus: "Past perfect",
      choices: ["had left", "left", "has left", "was leaving"],
    },
    {
      level: 4,
      prompt: "Select the correct form: There ___ many reasons.",
      answers: ["are"],
      tip: "Use are with plural nouns like reasons.",
      focus: "There is/are",
      choices: ["is", "are", "was", "be"],
    },
  ],
  phrases: [
    {
      level: 1,
      prompt: "Complete the phrase: make a ___.",
      answers: ["decision"],
      tip: "We make a decision, not do a decision.",
      focus: "Collocations",
      choices: ["decision", "mistake", "homework", "party"],
    },
    {
      level: 1,
      prompt: "Choose the correct phrase: take a ___.",
      answers: ["break"],
      tip: "We take a break when we rest.",
      focus: "Collocations",
      choices: ["break", "decision", "home", "progress"],
    },
    {
      level: 2,
      prompt: "Fill in: I'm looking ___ to the weekend.",
      answers: ["forward"],
      tip: "Look forward to means to be excited about something.",
      focus: "Phrasal verbs",
      choices: ["forward", "up", "out", "over"],
    },
    {
      level: 2,
      prompt: 'Phrase meaning: "call it a day" means ___.',
      answers: ["stop working", "finish for now"],
      tip: "It means you stop working for the day.",
      focus: "Idioms",
      choices: ["stop working", "start early", "work faster", "take notes"],
    },
    {
      level: 3,
      prompt: "Complete: pay ___ to the instructions.",
      answers: ["attention"],
      tip: "The collocation is pay attention.",
      focus: "Collocations",
      choices: ["attention", "money", "care", "visit"],
    },
    {
      level: 3,
      prompt: "Use the phrasal verb: She ___ up smoking last year.",
      answers: ["gave"],
      tip: "Give up means to stop doing something.",
      focus: "Phrasal verbs",
      choices: ["gave", "got", "took", "held"],
    },
    {
      level: 4,
      prompt: "Complete: in the ___ run, it will help.",
      answers: ["long"],
      tip: "In the long run means over a long period of time.",
      focus: "Idioms",
      choices: ["long", "wide", "first", "fast"],
    },
    {
      level: 4,
      prompt: 'Meaning of "on the same page" is ___.',
      answers: ["in agreement", "agree", "aligned"],
      tip: "It means people understand or agree with each other.",
      focus: "Idioms",
      choices: ["in agreement", "lost", "confused", "delayed"],
    },
  ],
  comprehension: [
    {
      level: 1,
      prompt:
        "Liam missed the bus, so he arrived late. Why was Liam late?",
      answers: ["he missed the bus", "missed the bus"],
      tip: "The cause is stated in the first clause.",
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
      tip: "Look for the reason word because.",
      focus: "Cause and effect",
      choices: [
        "It was cold.",
        "It was raining.",
        "It was windy.",
        "It was hot.",
      ],
    },
    {
      level: 2,
      prompt:
        "The meeting was postponed because the manager was sick. What happened to the meeting?",
      answers: ["it was postponed", "it was delayed"],
      tip: "Postponed means delayed.",
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
        "Sam declined the offer since it was too risky. Why did Sam decline the offer?",
      answers: ["it was too risky", "because it was too risky"],
      tip: "Declined means said no to something.",
      focus: "Reasoning",
      choices: [
        "It was too risky.",
        "It was too expensive.",
        "He was too busy.",
        "He changed his mind.",
      ],
    },
    {
      level: 3,
      prompt:
        "After months of training, Luis finally ran the marathon. How long did Luis train?",
      answers: ["months", "for months"],
      tip: "Look for the time phrase in the sentence.",
      focus: "Time details",
      choices: ["Months.", "Weeks.", "One day.", "Two years."],
    },
    {
      level: 3,
      prompt: "The report was concise but thorough. What best describes the report?",
      answers: ["brief and complete", "short but complete", "concise and thorough"],
      tip: "Concise means short, thorough means complete.",
      focus: "Paraphrase",
      choices: [
        "Brief and complete.",
        "Long and detailed.",
        "Unclear and messy.",
        "Fast and early.",
      ],
    },
    {
      level: 4,
      prompt:
        "Maya reread the instructions to avoid mistakes. What was Maya trying to avoid?",
      answers: ["mistakes"],
      tip: "Avoid mistakes means prevent errors.",
      focus: "Main idea",
      choices: ["Mistakes.", "Delays.", "Changes.", "Rules."],
    },
    {
      level: 4,
      prompt:
        "The street was flooded, so they took a longer route. Why did they take a longer route?",
      answers: ["the street was flooded", "because the street was flooded"],
      tip: "The reason is given before so.",
      focus: "Cause and effect",
      choices: [
        "The street was flooded.",
        "They were lost.",
        "They wanted a tour.",
        "The bus was late.",
      ],
    },
  ],
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const randomItem = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

const normalizeChoice = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const uniqueChoices = (choices: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];
  choices.forEach((choice) => {
    const key = normalizeChoice(choice);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(choice);
    }
  });
  return result;
};

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const accuracyFromHistory = (history: Result[]) => {
  if (history.length === 0) {
    return 0;
  }
  const correct = history.reduce(
    (total, item) => total + (item.correct ? 1 : 0),
    0
  );
  return correct / history.length;
};

const mapLevelToBand = (level: number) => clamp(Math.ceil(level / 2), 1, 4);

export const createDefaultStats = (): Stats => ({
  vocab: { level: 1, streak: 0, mistakeStreak: 0, history: [] },
  grammar: { level: 1, streak: 0, mistakeStreak: 0, history: [] },
  phrases: { level: 1, streak: 0, mistakeStreak: 0, history: [] },
  comprehension: { level: 1, streak: 0, mistakeStreak: 0, history: [] },
});

export const getAccuracy = (stats: SkillStats) =>
  accuracyFromHistory(stats.history);

export const getAverageMs = (stats: SkillStats) => {
  if (stats.history.length === 0) {
    return 0;
  }
  const total = stats.history.reduce((sum, item) => sum + item.ms, 0);
  return total / stats.history.length;
};

export const getTargetMs = (level: number) => {
  const base = 12000;
  const drop = 700;
  return clamp(base - level * drop, 5200, base);
};

export const getWeakestSkill = (stats: Stats): EnglishSkillKey => {
  let weakest: EnglishSkillKey = SKILL_LIST[0];
  let weakestScore = 1;

  SKILL_LIST.forEach((skill) => {
    const history = stats[skill].history;
    const accuracy = history.length === 0 ? 0.4 : accuracyFromHistory(history);
    const mistakePenalty = Math.min(0.15, stats[skill].mistakeStreak * 0.05);
    const score = clamp(accuracy - mistakePenalty, 0, 1);
    if (score < weakestScore) {
      weakestScore = score;
      weakest = skill;
    }
  });

  return weakest;
};

export const pickSkill = (stats: Stats): EnglishSkillKey => {
  const weighted = SKILL_LIST.map((skill) => {
    const history = stats[skill].history;
    const accuracy = history.length === 0 ? 0.4 : accuracyFromHistory(history);
    const mistakeBoost = Math.min(2, stats[skill].mistakeStreak) * 0.15;
    const lowAttemptsBoost = history.length < 4 ? 0.2 : 0;
    const weight = Math.max(0.2, 1 - accuracy) + mistakeBoost + lowAttemptsBoost;
    return { skill, weight };
  });

  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.skill;
    }
  }

  return "vocab";
};

export const updateStats = (
  stats: Stats,
  skill: EnglishSkillKey,
  correct: boolean,
  ms: number
): Stats => {
  const current = stats[skill];
  const nextHistory = [...current.history, { correct, ms }].slice(
    -MAX_HISTORY
  );
  const nextStreak = correct ? current.streak + 1 : 0;
  const nextMistakeStreak = correct ? 0 : current.mistakeStreak + 1;
  let nextLevel = current.level;
  let leveledUp = false;
  let leveledDown = false;

  if (correct && nextStreak >= 3 && ms <= getTargetMs(current.level)) {
    nextLevel = clamp(current.level + 1, 1, MAX_LEVEL);
    leveledUp = nextLevel !== current.level;
  }

  if (!correct && nextMistakeStreak >= 2) {
    nextLevel = clamp(current.level - 1, 1, MAX_LEVEL);
    leveledDown = nextLevel !== current.level;
  }

  return {
    ...stats,
    [skill]: {
      ...current,
      level: nextLevel,
      streak: correct && !leveledUp ? nextStreak : 0,
      mistakeStreak: !correct && !leveledDown ? nextMistakeStreak : 0,
      history: nextHistory,
    },
  };
};

const pickQuestionPool = (
  skill: EnglishSkillKey,
  band: number,
  focus?: string
) => {
  const byLevel = QUESTION_BANK[skill].filter(
    (question) => question.level === band
  );
  if (focus) {
    const focused = byLevel.filter((question) => question.focus === focus);
    if (focused.length > 0) {
      return focused;
    }
  }
  if (byLevel.length > 0) {
    return byLevel;
  }
  return QUESTION_BANK[skill];
};

const buildChoices = (spec: QuestionSpec, skill: EnglishSkillKey) => {
  const primaryAnswer = spec.answers[0];
  const baseChoices = spec.choices ? [...spec.choices] : [];
  if (
    primaryAnswer &&
    !baseChoices.some(
      (choice) => normalizeChoice(choice) === normalizeChoice(primaryAnswer)
    )
  ) {
    baseChoices.push(primaryAnswer);
  }

  const uniqueBase = uniqueChoices(baseChoices);
  if (uniqueBase.length >= 4) {
    return shuffle(uniqueBase).slice(0, 4);
  }

  const pool = QUESTION_BANK[skill]
    .flatMap((item) => item.choices ?? [])
    .filter(
      (choice) =>
        !spec.answers.some(
          (answer) => normalizeChoice(choice) === normalizeChoice(answer)
        )
    );

  const extras = shuffle(uniqueChoices(pool)).slice(
    0,
    Math.max(0, 4 - uniqueBase.length)
  );
  return shuffle([...uniqueBase, ...extras]);
};

export const generateQuestion = (args: {
  skill: EnglishSkillKey;
  level: number;
  stats: Stats;
  previousQuestion?: EnglishQuestion;
  previousCorrect?: boolean;
}): EnglishQuestion => {
  const { skill, level, stats, previousQuestion, previousCorrect } = args;
  const baseBand = mapLevelToBand(level);
  const shouldStepDown = stats[skill].mistakeStreak >= 2 || previousCorrect === false;
  const band = clamp(baseBand - (shouldStepDown ? 1 : 0), 1, 4);
  const focus =
    previousCorrect === false && previousQuestion?.skill === skill
      ? previousQuestion.focus
      : undefined;

  const pool = pickQuestionPool(skill, band, focus);
  const filtered =
    previousQuestion?.skill === skill
      ? pool.filter((item) => item.prompt !== previousQuestion.prompt)
      : pool;
  const pick = randomItem(filtered.length > 0 ? filtered : pool);

  return {
    id: `${skill}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    bankId: `${skill}:${pick.prompt}`,
    prompt: pick.prompt,
    answers: pick.answers,
    tip: pick.tip,
    focus: pick.focus,
    skill,
    level,
    choices: buildChoices(pick, skill),
  };
};
