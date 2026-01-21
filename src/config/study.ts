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
  title: "English Cheatsheet",
  intro:
    "Detailed reference guide for all core rules, patterns, and strategies to answer questions correctly. Each bullet tells you the rule, the common mistake, and what to do when you see a question on it.",
  sections: [
    {
      title: "Core sentence structure",
      description: "Master the basic word order and sentence patterns.",
      items: [
        "SVO word order: Subject + Verb + Object. Example answer: 'She reads books.' If asked to reorder words, put subject first, action next, thing last.",
        "Adjective order: Adjectives go before nouns. Use OSASCOMP order (opinion, size, age, shape, color, origin, material, purpose). Example: 'a nice small old round red Italian leather dining chair'. If a question asks which sounds natural, pick the OSASCOMP order.",
        "Adverb placement: Frequency adverbs (always/often/sometimes/never) go before the main verb, after be. 'He usually goes', 'She is often late'. If choices swap the adverb to the end, it's usually wrong.",
        "Negatives in present simple: Use 'do/does + not' + base verb. 'She does not go' (not 'She not goes'). When fixing a negative sentence, add do/does and keep the verb bare.",
        "Yes/No questions in present simple: Start with 'Do/Does' + subject + base verb. 'Does she go?' If the verb already has -s, remove it after does.",
        "Be verb exception: With am/is/are, do NOT use do/does. 'Is she happy?' 'She is not happy.' If a question mixes 'do' with 'be', remove 'do'.",
        "Imperatives: Start with the base verb to give instructions. 'Open the book.' If asked to choose a polite imperative, add 'please' or use 'Could you...?'",
        "How to answer quickly: Identify the verb, check if it is be/auxiliary, apply SVO, then check adverb/adjective positions. Most errors are word order or missing auxiliary.",
      ],
    },
    {
      title: "Tenses: when to use each one",
      description: "Choose the correct tense based on the time reference.",
      items: [
        "Present simple: Facts, habits, schedules. 'She works in a bank.' Signal words: every day, usually, always, often, sometimes. If time word shows routine, choose present simple.",
        "Present continuous (am/is/are + -ing): Actions happening now or temporary. 'She is working today.' Signal words: now, at the moment, currently, this week. Pick this when the action is in progress or temporary.",
        "Past simple: Finished actions with a clear past time. 'She worked there last year.' Signal words: yesterday, last year, ago, in 2020. If the time is finished, use past simple.",
        "Present perfect (have/has + past participle): Past action with link to now OR life experience. 'She has worked here for 5 years.' Signal words: for, since, ever, never, already, yet, just, recently. No specific finished time given.",
        "Past continuous (was/were + -ing): Action in progress at a past moment, often interrupted. 'When I called, she was working.' Use when two past actions overlap (long action + short action).",
        "Future 'will': Instant decisions, promises, predictions. 'I'll help you.' 'It will rain.' If the speaker decides now, choose will.",
        "Future 'going to': Plans made before now or predictions based on evidence. 'We are going to visit France.' 'Look at those clouds, it's going to rain.'",
        "Answering trick: Spot the time clue first. Map clue → tense. If two options share the same tense, check form (be/aux/participle) and subject-verb agreement.",
        "Short answers: Use auxiliary only. 'Do you...? Yes, I do.' 'Has she...? No, she hasn't.' Never repeat the main verb in short answers.",
      ],
    },
    {
      title: "Articles: a, an, the, or nothing",
      description: "Use the correct article to sound natural and clear.",
      items: [
        "A vs. an (sound rule): Use 'a' before consonant sounds (a dog, a university /juː/), 'an' before vowel sounds (an hour, an honest man). Focus on sound, not spelling.",
        "First mention = a/an: Introduce a new singular count noun with a/an. 'I saw a cat.' The listener does not know which one yet.",
        "Known or second mention = the: After first mention or when both know it. 'I saw a cat. The cat was orange.' Use 'the' when the noun is specific or unique in context.",
        "Zero article with plurals/uncountables (general): 'Books are useful.' 'Water is essential.' If the statement is general, use no article.",
        "Specific uncountables: Add 'the' when the listener knows which one. 'The water in this bottle.' 'The information you sent.'",
        "Places and proper nouns: Usually no article (Paris, English, Asia). Use 'the' with country groups and rivers: the United States, the UK, the Netherlands, the Amazon, the Pacific.",
        "Answering tip: Ask 'Is it specific and known?' If yes, use 'the'. If singular count but unknown, a/an. If plural/uncountable general, zero article.",
        "Common trap: Jobs always use a/an. 'She is a doctor.' Never 'She is doctor'.",
      ],
    },
    {
      title: "Prepositions: in, on, at, to, etc.",
      description: "Master common preposition patterns for time, place, and movement.",
      items: [
        "Time: at + clock times (at 3 PM), on + days/dates (on Monday, on April 5th), in + months/years/parts of day (in July, in 2024, in the morning). Exception: at night.",
        "Place: at + point (at the station), in + enclosed area (in the room/city/car), on + surface (on the table/wall/floor). Question tip: If you can stand inside, likely 'in'; if it's a point on a map, 'at'; if it's a surface, 'on'.",
        "Movement: go/come/travel + to, arrive at (small place), arrive in (city/country), get into a car, get on a bus/train/plane. If you see 'arrive to', fix it to 'arrive at/in'.",
        "Transport: on a bus/train/plane/ship, in a car/taxi. If unsure: large shared transport → on; personal/small vehicle → in.",
        "Adjective + preposition: interested in, scared of, tired of, proud of, good at, bad at, aware of. Memorize as chunks; questions often test the exact pair.",
        "Verb + preposition: listen to, wait for, depend on, agree with, believe in, apply for, think about. If multiple choices change the preposition, choose the fixed pair.",
        "Common traps: 'discuss' has no preposition ('discuss the plan' not 'discuss about'); 'enter' takes no preposition ('enter the room' not 'enter to the room').",
      ],
    },
    {
      title: "Vocabulary: word forms and building blocks",
      description: "Understand word relationships and combinations.",
      items: [
        "Word families: Learn noun/verb/adj/adv sets. Create → creation → creative → creatively. Decide → decision → decisive → decisively. In questions, pick the form that fits the grammar slot (noun after article, adj before noun, adv before verb).",
        "Prefixes that flip meaning: un- (happy → unhappy), dis- (agree → disagree), mis- (understand → misunderstand), in-/im-/il-/ir- (correct → incorrect, possible → impossible). If a question asks for opposite meaning, choose the correct prefix.",
        "Suffixes for part of speech: -tion/-sion (nouns), -ment (nouns), -ness (nouns), -ity (nouns), -able/-ible (adjectives), -ous (adjectives), -ly (adverbs). Use these to convert a base to the required form.",
        "Collocations: Natural word partners. Make a decision, take a break, do homework, have a shower, catch a cold, pay attention. If options sound odd with the noun, avoid them.",
        "Register and nuance: Big/large (neutral), huge/enormous (strong), tiny/minuscule (very small). Choose the option that matches the tone of the sentence (formal/informal, strong/neutral).",
        "Countable vs. uncountable: advice, furniture, information, luggage, homework are uncountable → no plural s; use 'some' or 'a piece of'. If an option says 'informations', it's wrong.",
        "Strategy: Identify the needed part of speech from the blank. If before a noun → adjective; after a linking verb → adjective; after an adverb-needed slot → choose -ly form.",
      ],
    },
    {
      title: "Phrasal verbs and idioms",
      description: "Understand fixed phrases and verb combinations.",
      items: [
        "Definition: Phrasal verb = verb + particle (preposition/adverb) with a new meaning. Meaning can change completely: 'give up' = quit, not give + up literally.",
        "Separable vs. inseparable: 'Turn down the music' = 'turn it down' (separable). 'Look after the kids' ≠ 'look them after' (inseparable). If a pronoun is used with a separable phrasal verb, it goes between verb and particle.",
        "Common phrasal verbs: give up (quit), put off (delay), turn down (reject), carry on (continue), find out (discover), run into (meet by chance), get along (have good relationship), look up (search/admire), pick up (collect/learn), put up with (tolerate).",
        "Idioms to recognize: call it a day (stop working), on the same page (agree), piece of cake (easy), break the ice (start conversation), in the long run (eventually), hit the books (study hard), raining cats and dogs (raining heavily).",
        "Fixed phrases that stay together: as soon as possible, in the long run, for the time being, in conclusion, by the way, on purpose. Do not change their order.",
        "Answering tip: If options change the particle (on/at/for), pick the one that is the real phrasal verb you know. For idioms, choose the option that keeps the phrase intact.",
        "Memory hack: Write one personal sentence for each phrasal verb. Active use cements meaning better than lists.",
      ],
    },
    {
      title: "Reading comprehension strategies",
      description: "Understand texts quickly and answer questions accurately.",
      items: [
        "Step 1: Read the question first. Know what you are hunting for before reading the passage. This focuses your scan.",
        "Step 2: Skim for structure. First sentence of each paragraph often holds the main idea. Note headings, topic sentences, contrast words.",
        "Step 3: Track signal words. Because/so (cause/effect), however/but/although (contrast), therefore/as a result (conclusion), for example/for instance (example). These tell you where answers sit.",
        "Step 4: Paraphrase to confirm understanding. Restate each tricky sentence in your own words. If you cannot paraphrase, reread until you can.",
        "Step 5: Answer with evidence. Support every answer with a phrase from the text. If you cannot point to the sentence, the answer is risky.",
        "Step 6: Inference questions. Use clues + logic, but stay inside the text. If coat + shiver → weather is cold. Do not add outside knowledge.",
        "Step 7: True/False/Not Given. True = matches text, False = contradicts text, Not Given = text never says. If you cannot find evidence, choose Not Given.",
        "Timing tip: If stuck, move on and return. Questions often follow passage order, so later questions may guide you back to the right paragraph.",
      ],
    },
    {
      title: "Subject-Verb Agreement",
      description: "Match singular and plural correctly.",
      items: [
        "3rd person singular: He/She/It takes verb + s/es in present simple. He goes, she watches, it flies. If the subject is singular, add the s; if plural, no s.",
        "Compound subjects with and: Usually plural. 'John and Mary are coming.' Exception: If it is one person/thing with two titles 'The president and CEO is speaking.'",
        "Either/Neither + or/nor: Verb matches the subject closest to it. 'Either the students or the teacher is here.' 'Neither the cat nor the dogs are hungry.'",
        "Indefinite pronouns: Everyone, someone, anyone, nobody, each, every + singular verb. 'Everyone is ready.' 'Each student has a book.'",
        "Amounts and distances: Ten dollars is (money as a unit). Five miles is a long walk. If the amount is one unit, use singular.",
        "Collective nouns: Team/family/government can be singular (as one unit) or plural (as individuals). US English: usually singular. UK English: can be plural. Pick singular unless context shows individuals.",
        "Plural-looking singulars: News, physics, athletics, mathematics take singular verbs. 'The news is good.'",
        "Answering tip: Find the real subject, ignore words between subject and verb. Cross out prepositional phrases to spot the subject quickly.",
      ],
    },
    {
      title: "Answering strategy overview",
      description: "Fast checklist to choose the right answer under time pressure.",
      items: [
        "Identify the question type first: grammar (tense/agreement), vocab (collocation/form), reading (detail/inference/TFNG).",
        "Scan for signal words: time markers (yesterday/now/for/since), contrast (but/however), cause/effect (because/so). They decide tense and logic.",
        "Eliminate form errors: subject-verb agreement, article usage, wrong preposition, wrong word form (-ly/-tion/-ed/-ing).",
        "Check meaning last: After form fits, confirm the meaning matches the sentence. If two answers are grammatical, pick the one that fits meaning and collocation.",
        "Use evidence: For reading, underline the exact phrase that supports your answer. No evidence = risky answer.",
        "Watch common traps: double negatives, mixing 'do' with 'be', plural s on uncountables (informations, furnitures), wrong particle in phrasal verbs.",
      ],
    },
  ],
};
