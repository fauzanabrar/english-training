import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { storage } from "@/lib/storage";
import type {
  SettingControl,
  TrainingMode,
  TrainingProvider,
  TrainingQuestion,
  TrainingSettingsBase,
} from "./types";

type Screen = "menu" | "drill" | "settings" | "summary" | "stats" | "study";

type Feedback<SkillKey extends string> = {
  correct: boolean;
  expected: string;
  ms: number;
  skill: SkillKey;
  level: number;
  timedOut?: boolean;
};

type SessionCounts = {
  correct: number;
  wrong: number;
};

type WrongQuestionEntry<Question> = {
  key: string;
  question: Question;
  attempts: number;
  lastMissed: number;
};

type UseTrainingSessionOptions<
  SkillKey extends string,
  Question extends TrainingQuestion<SkillKey>,
  Settings extends TrainingSettingsBase,
  AnswerValue
> = {
  provider: TrainingProvider<SkillKey, Question, Settings, AnswerValue>;
  storageKeys: {
    session: string;
    settings: string;
    wrongQuestions?: string;
  };
  onSessionComplete?: () => void;
};

const normalizeSettings = <Settings,>(
  settings: Settings,
  controls: SettingControl<Settings>[]
) => {
  let next = { ...settings } as Settings;
  controls.forEach((control) => {
    const value = control.getValue(next);
    const clamped = Math.min(Math.max(value, control.min), control.max);
    if (value !== clamped) {
      next = control.setValue(next, clamped);
    }
  });
  return next;
};

const MAX_WRONG_QUESTIONS = 40;

export const useTrainingSession = <
  SkillKey extends string,
  Question extends TrainingQuestion<SkillKey>,
  Settings extends TrainingSettingsBase,
  AnswerValue
>({
  provider,
  storageKeys,
  onSessionComplete,
}: UseTrainingSessionOptions<
  SkillKey,
  Question,
  Settings,
  AnswerValue
>) => {
  type Mode = TrainingMode<SkillKey>;

  const initialState = useMemo(() => {
    const normalizedSettings = normalizeSettings(
      provider.settings.defaultValue,
      provider.settings.controls
    );
    return {
      stats: provider.createDefaultStats(),
      mode: "mix" as Mode,
      settings: normalizedSettings,
      timeLeft: normalizedSettings.timeLimitSeconds,
      wrongQuestions: [],
      sessionTotal: normalizedSettings.questionCount,
    };
  }, [provider]);

  const [stats, setStats] = useState(initialState.stats);
  const [mode, setMode] = useState<Mode>(initialState.mode);
  const [screen, setScreen] = useState<Screen>("menu");
  const [settings, setSettings] = useState<Settings>(initialState.settings);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback<SkillKey> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionCounts>({
    correct: 0,
    wrong: 0,
  });
  const [questionIndex, setQuestionIndex] = useState(1);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [answered, setAnswered] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<
    WrongQuestionEntry<Question>[]
  >(initialState.wrongQuestions);
  const [sessionTotal, setSessionTotal] = useState(
    initialState.sessionTotal
  );
  const [storageReady, setStorageReady] = useState(false);

  const startTimeRef = useRef<number>(0);
  const advanceTimerRef = useRef<number | null>(null);
  const statsRef = useRef(stats);
  const modeRef = useRef(mode);
  const sessionTotalRef = useRef(sessionTotal);
  const lastOutcomeRef = useRef<{ question: Question; correct: boolean } | null>(
    null
  );
  const reviewQueueRef = useRef<WrongQuestionEntry<Question>[]>([]);

  useEffect(() => {
    if (storageReady) {
      return;
    }
    const savedSession = storage.readJSON<{
      stats?: ReturnType<typeof provider.createDefaultStats>;
      mode?: Mode;
    }>(storageKeys.session);
    const savedSettings = storage.readJSON<Partial<Settings>>(
      storageKeys.settings
    );
    const savedWrongQuestions = storageKeys.wrongQuestions
      ? storage.readJSON<WrongQuestionEntry<Question>[]>(
          storageKeys.wrongQuestions
        )
      : null;
    const merged = {
      ...provider.settings.defaultValue,
      ...savedSettings,
    } as Settings;
    const normalizedSettings = normalizeSettings(
      merged,
      provider.settings.controls
    );
    if (savedSession?.stats) {
      setStats(savedSession.stats);
    }
    if (savedSession?.mode) {
      setMode(savedSession.mode);
    }
    if (Array.isArray(savedWrongQuestions)) {
      setWrongQuestions(savedWrongQuestions);
    }
    setSettings(normalizedSettings);
    setTimeLeft(normalizedSettings.timeLimitSeconds);
    setSessionTotal(normalizedSettings.questionCount);
    setStorageReady(true);
  }, [provider, storageKeys, storageReady]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }
    storage.writeJSON(storageKeys.session, { stats, mode });
  }, [stats, mode, storageKeys, storageReady]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }
    storage.writeJSON(storageKeys.settings, settings);
  }, [settings, storageKeys, storageReady]);

  useEffect(() => {
    if (!storageReady || !storageKeys.wrongQuestions) {
      return;
    }
    storage.writeJSON(storageKeys.wrongQuestions, wrongQuestions);
  }, [storageKeys.wrongQuestions, wrongQuestions, storageReady]);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    sessionTotalRef.current = sessionTotal;
  }, [sessionTotal]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const getQuestionKey = useCallback(
    (item: Question) =>
      provider.getQuestionKey ? provider.getQuestionKey(item) : item.id,
    [provider]
  );

  const upsertWrongQuestion = useCallback(
    (item: Question) => {
      if (!storageKeys.wrongQuestions) {
        return;
      }
      const key = getQuestionKey(item);
      const now = Date.now();
      setWrongQuestions((prev) => {
        const existing = prev.find((entry) => entry.key === key);
        const nextEntry: WrongQuestionEntry<Question> = {
          key,
          question: item,
          attempts: (existing?.attempts ?? 0) + 1,
          lastMissed: now,
        };
        const filtered = prev.filter((entry) => entry.key !== key);
        const next = [nextEntry, ...filtered];
        return next.slice(0, MAX_WRONG_QUESTIONS);
      });
    },
    [getQuestionKey, storageKeys.wrongQuestions]
  );

  const removeWrongQuestion = useCallback(
    (item: Question) => {
      if (!storageKeys.wrongQuestions) {
        return;
      }
      const key = getQuestionKey(item);
      setWrongQuestions((prev) => prev.filter((entry) => entry.key !== key));
    },
    [getQuestionKey, storageKeys.wrongQuestions]
  );

  const allowNegativeAnswer = useMemo(() => {
    if (!question || !provider.answer.allowNegative) {
      return false;
    }
    return provider.answer.allowNegative(question, settings);
  }, [provider.answer, question, settings]);

  const keypadRows = useMemo(() => {
    if (!provider.answer.keypad?.enabled) {
      return null;
    }
    return provider.answer.keypad.rows({ allowNegative: allowNegativeAnswer });
  }, [provider.answer.keypad, allowNegativeAnswer]);

  const beginQuestion = useCallback(
    (nextQuestion: Question) => {
      setQuestion(nextQuestion);
      setAnswer("");
      setError(null);
      setFeedback(null);
      setAnswered(false);
      startTimeRef.current = Date.now();
      setTimeLeft(settings.timeLimitSeconds);
    },
    [settings.timeLimitSeconds]
  );

  const createQuestion = useCallback(
    (selectedMode: Mode) => {
      const lastOutcome = lastOutcomeRef.current;
      const resolvedMode = selectedMode === "review" ? "mix" : selectedMode;
      const skill =
        resolvedMode === "mix"
          ? lastOutcome && !lastOutcome.correct
            ? lastOutcome.question.skill
            : provider.pickSkill(statsRef.current)
          : resolvedMode;
      const level = statsRef.current[skill].level;
      return provider.createQuestion({
        skill,
        level,
        settings,
        stats: statsRef.current,
        previousQuestion: lastOutcome?.question,
        previousCorrect: lastOutcome?.correct,
      });
    },
    [provider, settings]
  );

  const buildReviewQueue = useCallback(() => {
    const sorted = [...wrongQuestions].sort(
      (a, b) => b.lastMissed - a.lastMissed
    );
    return sorted;
  }, [wrongQuestions]);

  const getNextReviewQuestion = useCallback(() => {
    const nextEntry = reviewQueueRef.current.shift();
    return nextEntry ? nextEntry.question : null;
  }, []);

  const startSession = useCallback(
    (nextMode: Mode) => {
      clearAdvanceTimer();
      setMode(nextMode);
      modeRef.current = nextMode;
      lastOutcomeRef.current = null;
      setSession({ correct: 0, wrong: 0 });
      setQuestionIndex(1);
      reviewQueueRef.current = [];
      const isReview = nextMode === "review";
      const queue = isReview ? buildReviewQueue() : [];
      const totalQuestions = isReview ? queue.length : settings.questionCount;
      setSessionTotal(totalQuestions);
      sessionTotalRef.current = totalQuestions;

      if (isReview) {
        if (totalQuestions === 0) {
          setScreen("menu");
          return;
        }
        reviewQueueRef.current = queue.slice(0, totalQuestions);
        const nextQuestion = getNextReviewQuestion();
        if (!nextQuestion) {
          setScreen("menu");
          return;
        }
        setScreen("drill");
        beginQuestion(nextQuestion);
        return;
      }

      setScreen("drill");
      const nextQuestion = createQuestion(nextMode);
      beginQuestion(nextQuestion);
    },
    [
      beginQuestion,
      buildReviewQueue,
      clearAdvanceTimer,
      createQuestion,
      getNextReviewQuestion,
      settings.questionCount,
    ]
  );

  const goToMenu = useCallback(() => {
    clearAdvanceTimer();
    setScreen("menu");
    setQuestion(null);
    setFeedback(null);
    setError(null);
    setAnswer("");
    setAnswered(false);
    lastOutcomeRef.current = null;
    reviewQueueRef.current = [];
  }, [clearAdvanceTimer]);

  const applyResult = useCallback(
    (correct: boolean, elapsed: number, timedOut = false) => {
      if (!question) {
        return;
      }
      const nextStats = provider.updateStats(statsRef.current, {
        skill: question.skill,
        correct,
        elapsedMs: elapsed,
      });
      statsRef.current = nextStats;
      setStats(nextStats);
      setFeedback({
        correct,
        expected: provider.answer.formatExpected(question),
        ms: elapsed,
        skill: question.skill,
        level: question.level,
        timedOut,
      });
      lastOutcomeRef.current = { question, correct };
      if (correct) {
        removeWrongQuestion(question);
      } else {
        upsertWrongQuestion(question);
      }
      setSession((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
      }));
      setError(null);
      setAnswered(true);
    },
    [provider, question, removeWrongQuestion, upsertWrongQuestion]
  );

  const evaluateAnswer = useCallback(
    (rawValue: string, prefersKeypadErrors: boolean) => {
      if (!question || answered) {
        return;
      }
      const allowNegative = allowNegativeAnswer;
      const cleaned = provider.answer.sanitizeInput(rawValue.trim(), {
        allowNegative,
      });
      setAnswer(cleaned);
      const parsed = provider.answer.parseInput(cleaned, { allowNegative });
      if (parsed.error) {
        if (parsed.error === "empty") {
          setError(
            prefersKeypadErrors
              ? provider.answer.errors.emptyKeypad ??
                  provider.answer.errors.empty
              : provider.answer.errors.empty
          );
          return;
        }
        if (parsed.error === "incomplete") {
          setError(provider.answer.errors.incomplete);
          return;
        }
        setError(provider.answer.errors.invalid);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const correct = provider.answer.isCorrect(
        parsed.value as AnswerValue,
        question
      );

      clearAdvanceTimer();
      applyResult(correct, elapsed);
    },
    [
      allowNegativeAnswer,
      answered,
      applyResult,
      clearAdvanceTimer,
      provider.answer,
      question,
    ]
  );

  const handleSubmit = useCallback(
    (options?: { useKeypad?: boolean }) => {
      evaluateAnswer(answer, Boolean(options?.useKeypad));
    },
    [answer, evaluateAnswer]
  );

  const handleChoiceSelect = useCallback(
    (rawValue: string) => {
      setError(null);
      evaluateAnswer(rawValue, false);
    },
    [evaluateAnswer]
  );

  const handleAnswerChange = useCallback(
    (rawValue: string) => {
      const cleaned = provider.answer.sanitizeInput(rawValue, {
        allowNegative: allowNegativeAnswer,
      });
      setAnswer(cleaned);
      setError(null);
    },
    [allowNegativeAnswer, provider.answer]
  );

  const handleKeypadPress = useCallback(
    (key: string) => {
      if (answered) {
        return;
      }
      setError(null);
      if (key === "CLR") {
        setAnswer("");
        return;
      }
      if (key === "DEL") {
        setAnswer((prev) => prev.slice(0, -1));
        return;
      }
      if (key === "-") {
        if (!allowNegativeAnswer) {
          return;
        }
        setAnswer((prev) => {
          if (prev.startsWith("-")) {
            return prev.slice(1);
          }
          if (prev.length === 0) {
            return "-";
          }
          if (prev === "0") {
            return "-0";
          }
          return `-${prev}`;
        });
        return;
      }
      setAnswer((prev) => {
        if (prev === "0") {
          return key;
        }
        if (prev === "-0") {
          return `-${key}`;
        }
        return prev + key;
      });
    },
    [allowNegativeAnswer, answered]
  );

  const handleNext = useCallback(() => {
    if (!question || !answered) {
      return;
    }
    clearAdvanceTimer();
    const nextIndex = questionIndex + 1;
    if (nextIndex > sessionTotalRef.current) {
      setScreen("summary");
      setQuestion(null);
      setAnswered(false);
      if (onSessionComplete) {
        onSessionComplete();
      }
      return;
    }
    setQuestionIndex(nextIndex);
    const nextQuestion =
      modeRef.current === "review"
        ? getNextReviewQuestion()
        : createQuestion(modeRef.current);
    if (!nextQuestion) {
      setScreen("summary");
      setQuestion(null);
      setAnswered(false);
      if (onSessionComplete) {
        onSessionComplete();
      }
      return;
    }
    beginQuestion(nextQuestion);
  }, [
    answered,
    beginQuestion,
    clearAdvanceTimer,
    createQuestion,
    getNextReviewQuestion,
    onSessionComplete,
    question,
    questionIndex,
  ]);

  const handleTimeout = useCallback(() => {
    if (!question || answered) {
      return;
    }
    const elapsed = Date.now() - startTimeRef.current;
    applyResult(false, elapsed, true);
  }, [answered, applyResult, question]);

  const resetStats = useCallback(() => {
    const fresh = provider.createDefaultStats();
    statsRef.current = fresh;
    setStats(fresh);
    if (storageKeys.wrongQuestions) {
      setWrongQuestions([]);
    }
  }, [provider, storageKeys.wrongQuestions]);

  const adjustSetting = useCallback(
    (controlId: string, delta: number) => {
      const control = provider.settings.controls.find(
        (item) => item.id === controlId
      );
      if (!control) {
        return;
      }
      setSettings((prev) => {
        const current = control.getValue(prev);
        const nextValue = Math.min(
          Math.max(current + control.step * delta, control.min),
          control.max
        );
        return control.setValue(prev, nextValue);
      });
    },
    [provider.settings.controls]
  );

  useEffect(() => {
    if (screen !== "drill" || !question || answered) {
      return;
    }
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, [answered, handleTimeout, question, screen, settings.timeLimitSeconds]);

  useEffect(() => {
    if (!feedback || !feedback.correct) {
      return;
    }
    clearAdvanceTimer();
    advanceTimerRef.current = window.setTimeout(() => {
      handleNext();
    }, 700);
    return () => {
      clearAdvanceTimer();
    };
  }, [feedback, clearAdvanceTimer, handleNext]);

  const wrongQuestionCount = wrongQuestions.length;

  return {
    screen,
    setScreen,
    stats,
    mode,
    settings,
    question,
    answer,
    feedback,
    error,
    session,
    questionIndex,
    sessionTotal,
    timeLeft,
    answered,
    allowNegativeAnswer,
    keypadRows,
    wrongQuestionCount,
    startSession,
    goToMenu,
    handleChoiceSelect,
    handleSubmit,
    handleNext,
    handleTimeout,
    handleAnswerChange,
    handleKeypadPress,
    resetStats,
    adjustSetting,
  };
};

export type TrainingScreen = Screen;
