import {
  createDefaultStats,
  generateQuestion,
  getAccuracy,
  getAverageMs,
  getTargetMs,
  getWeakestSkill,
  MAX_LEVEL,
  pickSkill,
  updateStats,
  SKILL_LABELS,
  SKILL_SYMBOLS,
  type EnglishQuestion,
  type EnglishSkillKey,
} from "@/lib/english";
import type {
  AnswerParseResult,
  SettingControl,
  TrainingProvider,
  TrainingSettingsBase,
} from "../types";

type EnglishSettings = TrainingSettingsBase;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const DEFAULT_SETTINGS: EnglishSettings = {
  questionCount: 10,
  timeLimitSeconds: 20,
};

const SKILL_ORDER: EnglishSkillKey[] = [
  "vocab",
  "grammar",
  "phrases",
  "comprehension",
];

const SKILL_DEFINITIONS = {
  vocab: {
    label: SKILL_LABELS.vocab,
    symbol: SKILL_SYMBOLS.vocab,
    subtitle: "Build meaning and word choice",
  },
  grammar: {
    label: SKILL_LABELS.grammar,
    symbol: SKILL_SYMBOLS.grammar,
    subtitle: "Tenses, articles, and structure",
  },
  phrases: {
    label: SKILL_LABELS.phrases,
    symbol: SKILL_SYMBOLS.phrases,
    subtitle: "Collocations and everyday phrases",
  },
  comprehension: {
    label: SKILL_LABELS.comprehension,
    symbol: SKILL_SYMBOLS.comprehension,
    subtitle: "Read for meaning and detail",
  },
} satisfies Record<
  EnglishSkillKey,
  { label: string; symbol: string; subtitle: string }
>;

const settingControls: SettingControl<EnglishSettings>[] = [
  {
    id: "questionCount",
    label: "Questions per session",
    hint: "Default is 10",
    min: 5,
    max: 30,
    step: 1,
    getValue: (settings) => settings.questionCount,
    setValue: (settings, value) => ({
      ...settings,
      questionCount: clampValue(value, 5, 30),
    }),
  },
  {
    id: "timeLimitSeconds",
    label: "Time per question",
    hint: "More time for reading and recall",
    min: 10,
    max: 60,
    step: 5,
    getValue: (settings) => settings.timeLimitSeconds,
    setValue: (settings, value) => ({
      ...settings,
      timeLimitSeconds: clampValue(value, 10, 60),
    }),
    formatValue: (value) => `${value}s`,
  },
];

const sanitizeTextInput = (raw: string): string =>
  raw.replace(/[^a-zA-Z0-9\s'-]/g, "").replace(/\s+/g, " ").trim();

const normalizeAnswer = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const parseTextInput = (value: string): AnswerParseResult<string> => {
  if (!value.trim()) {
    return { error: "empty" };
  }
  return { value: value.trim() };
};

export const englishTrainingProvider: TrainingProvider<
  EnglishSkillKey,
  EnglishQuestion,
  EnglishSettings,
  string
> = {
  id: "english",
  title: "English Training",
  description: "Deliberate practice across vocabulary, grammar, and reading.",
  skillOrder: SKILL_ORDER,
  skills: SKILL_DEFINITIONS,
  maxLevel: MAX_LEVEL,
  createDefaultStats,
  createQuestion: ({ skill, level, stats, previousQuestion, previousCorrect }) =>
    generateQuestion({
      skill,
      level,
      stats,
      previousQuestion,
      previousCorrect,
    }),
  getQuestionText: (question) => question.prompt,
  updateStats: (stats, { skill, correct, elapsedMs }) =>
    updateStats(stats, skill, correct, elapsedMs),
  getAccuracy,
  getAverageMs,
  getTargetMs,
  getWeakestSkill,
  pickSkill,
  getQuestionKey: (question) => question.bankId,
  answer: {
    inputMode: "text",
    placeholder: "Choose the best answer",
    sanitizeInput: (raw) => sanitizeTextInput(raw),
    parseInput: (value) => parseTextInput(value),
    isCorrect: (value, question) =>
      question.answers.some(
        (answer) => normalizeAnswer(answer) === normalizeAnswer(value)
      ),
    formatExpected: (question) => question.answers[0] ?? "",
    errors: {
      empty: "Choose an answer.",
      incomplete: "Choose an answer.",
      invalid: "Choose an answer.",
    },
  },
  settings: {
    defaultValue: DEFAULT_SETTINGS,
    controls: settingControls,
  },
};
