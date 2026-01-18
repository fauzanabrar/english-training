import { appConfig } from "./app";
import { englishTrainingProvider } from "@/features/training/providers/englishTrainingProvider";

type ProviderSkillKey = keyof typeof englishTrainingProvider.skills;
type TrainingModeKey = ProviderSkillKey | "mix";

const storagePrefix = appConfig.storagePrefix;

const mixMode: {
  key: TrainingModeKey;
  label: string;
  subtitle: string;
  icon: string;
} = {
  key: "mix" as const,
  label: "Adaptive mix",
  subtitle: "Deliberate practice on weak spots",
  icon: "A",
};

const skillModes: Array<{
  key: ProviderSkillKey;
  label: string;
  subtitle: string;
  icon: string;
}> = englishTrainingProvider.skillOrder.map((skill) => ({
  key: skill,
  label: englishTrainingProvider.skills[skill].label,
  subtitle: englishTrainingProvider.skills[skill].subtitle,
  icon: englishTrainingProvider.skills[skill].symbol,
}));

export const trainingConfig = {
  provider: englishTrainingProvider,
  storageKeys: {
    session: `${storagePrefix}:session`,
    settings: `${storagePrefix}:settings`,
    theme: `${storagePrefix}:theme`,
    wrongQuestions: `${storagePrefix}:wrong-questions`,
  },
  modes: [mixMode, ...skillModes] as Array<{
    key: TrainingModeKey;
    label: string;
    subtitle: string;
    icon: string;
  }>,
  copy: {
    brand: {
      name: appConfig.name,
      shortName: appConfig.shortName,
    },
    menu: {
      title: "Choose your English focus",
      description:
        "Pick a skill or use Adaptive mix to target what needs the most attention.",
      statsAction: "Progress",
      studyAction: "English cheatset",
      reviewAction: "Practice wrong answers",
      reviewLabel: "Wrong answers",
      settingsAction: "Settings",
      questionsSuffix: "questions",
      timeSuffix: "s per question",
      weakestPrefix: "Weakest:",
      wrongPrefix: "Wrong bank:",
    },
    drill: {
      subtitle: "Choose the best answer, fix weak spots, and level up.",
      questionLabel: "Question",
      timeLabel: "Time",
      skillLabel: "Skill",
      focusLabel: "Focus",
      levelLabel: "Level",
      targetLabel: "Target",
      answerPlaceholder: "Choose the best answer",
      answerPlaceholderKeypad: "Tap to answer",
      checkAction: "Check",
      nextAction: "Next",
      loading: "Loading your prompt...",
      sessionScoreLabel: "Session score",
      sessionHint: "Deliberate practice keeps you improving.",
      tipLabel: "Tip",
    },
    stats: {
      title: "Progress",
      intro:
        "Your recent practice across skills (last 12 attempts per skill).",
      overallTitle: "Overall",
      overallIntro: "Based on your recent attempts across all skills.",
      accuracyLabel: "Accuracy",
      attemptsLabel: "Attempts",
      avgTimeLabel: "Avg time",
      noData: "No data yet",
      noAttempts: "No attempts yet",
    },
    summary: {
      title: "Session complete",
      accuracyLabel: "Accuracy",
      correctLabel: "Correct",
      wrongLabel: "Wrong",
      practiceAgain: "Practice again",
      backToMenu: "Back to menu",
    },
    settings: {
      title: "Settings",
      intro: "Tune the session size and time per question.",
      themeLabel: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      resetStats: "Reset all stats",
      backToMenu: "Back to menu",
    },
    appBar: {
      menu: appConfig.name,
      drillSuffix: "practice",
      summary: "Session summary",
      stats: "Progress",
      study: "English cheatset",
      settings: "Settings",
    },
    feedback: {
      correctPrefix: "Correct.",
      wrongPrefix: "Not quite. Answer:",
      timeoutPrefix: "Time's up. Answer:",
    },
  },
};
