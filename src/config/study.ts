type StudySection = {
  title: string;
  description?: string;
  items: string[];
};

export const studyConfig: {
  title: string;
  intro: string;
  sections: StudySection[];
} = {
  title: "English Cheatset",
  intro:
    "Quick reference for all core rules and patterns covered in practice.",
  sections: [
    {
      title: "Core sentence structure",
      description: "The basic building blocks.",
      items: [
        "Subject + verb + object: She reads books.",
        "Adjectives go before nouns: a bright idea.",
        "Adverbs often go before the main verb: He usually goes.",
        "Negatives use do/does not in present simple: She does not go.",
      ],
    },
    {
      title: "Tenses quick map",
      description: "When each tense is used.",
      items: [
        "Present simple: habits and facts.",
        "Present continuous: actions happening now.",
        "Past simple: finished past actions.",
        "Present perfect: past with relevance now.",
        "Future: will for decisions, going to for plans.",
      ],
    },
    {
      title: "Articles and determiners",
      description: "a/an, the, and no article.",
      items: [
        "Use a/an for first mention and singular count nouns.",
        "Use the for specific or known nouns.",
        "No article for plurals in general: Dogs are friendly.",
        "Use this/that/these/those for pointing.",
      ],
    },
    {
      title: "Prepositions",
      description: "Common patterns to memorize.",
      items: [
        "Time: at 3 PM, on Monday, in July.",
        "Place: at the station, in the city, on the street.",
        "Movement: go to, arrive at, arrive in.",
        "Common pairs: interested in, good at, depend on.",
      ],
    },
    {
      title: "Vocabulary and word forms",
      description: "Build words into usable language.",
      items: [
        "Learn synonyms in pairs: quick/fast, reliable/dependable.",
        "Use prefixes and suffixes: happy/unhappy, create/creative.",
        "Practice collocations: make a decision, take a break.",
        "Store words in phrases, not alone.",
      ],
    },
    {
      title: "Phrases and idioms",
      description: "Everyday English building blocks.",
      items: [
        "Phrasal verbs: give up, look forward to.",
        "Idioms: call it a day, on the same page.",
        "Fixed phrases: as soon as possible, in the long run.",
        "Use them in a full sentence to remember.",
      ],
    },
    {
      title: "Reading and comprehension",
      description: "Find meaning fast.",
      items: [
        "Look for signal words: because, so, however.",
        "Identify the main idea before details.",
        "Paraphrase each sentence in simple words.",
        "Answer: who, what, when, why.",
      ],
    },
  ],
};
