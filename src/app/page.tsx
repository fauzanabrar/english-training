"use client";

import { useCallback, useEffect, useMemo, type ReactElement } from "react";
import styles from "./page.module.css";
import { adsConfig } from "@/config/ads";
import { trainingConfig } from "@/config/training";
import { studyConfig } from "@/config/study";
import { InlineScriptAdSlot } from "@/components/ads/InlineScriptAdSlot";
import { popUnderAd } from "@/components/PopUnderAd";
import { useTrainingSession } from "@/features/training/useTrainingSession";
import { useThemeMode } from "@/hooks/useThemeMode";


const formatMs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const formatSeconds = (value: number) => `${String(value).padStart(2, "0")}s`;

const inlineAdConfig = {
  ...adsConfig.inline,
  enabled: adsConfig.enabled && adsConfig.inline.enabled,
};

const popUnderEnabled = adsConfig.enabled && adsConfig.popUnder.enabled;

export default function Home() {
  const { provider, modes, storageKeys, copy } = trainingConfig;

  const { theme, toggleTheme } = useThemeMode(storageKeys.theme);

  const handleSessionComplete = useCallback(() => {
    if (popUnderEnabled) {
      popUnderAd.show();
    }
  }, []);

  const {
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
    wrongQuestionCount,
    startSession,
    goToMenu,
    handleNext,
    handleChoiceSelect,
    resetStats,
    adjustSetting,
  } = useTrainingSession({
    provider,
    storageKeys,
    onSessionComplete: handleSessionComplete,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.history.replaceState({ screen: "menu" }, "");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (screen === "menu") {
      window.history.replaceState({ screen: "menu" }, "");
      return;
    }
    window.history.pushState({ screen }, "");
  }, [screen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handlePopState = () => {
      if (screen !== "menu") {
        goToMenu();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [goToMenu, screen]);

  const skillKeys = provider.skillOrder;
  const hasAttempts = useMemo(
    () => Object.values(stats).some((entry) => entry.history.length > 0),
    [stats]
  );
  const weakestSkill = useMemo(
    () => provider.getWeakestSkill(stats),
    [provider, stats]
  );
  const weaknessText = hasAttempts
    ? provider.skills[weakestSkill].label
    : copy.stats.noData;

  const mixModeLabel =
    modes.find((item) => item.key === "mix")?.label ?? "Mix";
  const reviewLabel = copy.menu.reviewLabel ?? copy.menu.reviewAction;
  const modeLabel =
    mode === "review"
      ? reviewLabel
      : mode === "mix"
        ? mixModeLabel
        : provider.skills[mode].label;
  const timeLeftLabel = formatSeconds(timeLeft);
  const appBarTitle =
    screen === "menu"
      ? copy.appBar.menu
      : screen === "drill"
        ? `${modeLabel} ${copy.appBar.drillSuffix}`
        : screen === "summary"
          ? copy.appBar.summary
          : screen === "stats"
            ? copy.appBar.stats
            : screen === "study"
              ? copy.appBar.study
              : copy.appBar.settings;

  const totalAnswered = session.correct + session.wrong;
  const accuracy = totalAnswered
    ? Math.round((session.correct / totalAnswered) * 100)
    : 0;
  const allHistory = skillKeys.flatMap((skill) => stats[skill].history);
  const allCorrect = allHistory.filter((item) => item.correct).length;
  const allAttempts = allHistory.length;
  const overallAccuracy = allAttempts
    ? Math.round((allCorrect / allAttempts) * 100)
    : 0;
  const totalMs = allHistory.reduce((sum, item) => sum + item.ms, 0);
  const overallAvgMs = allAttempts ? totalMs / allAttempts : 0;
  const feedbackText = feedback
    ? feedback.correct
      ? `${copy.feedback.correctPrefix} ${formatMs(feedback.ms)}.`
      : feedback.timedOut
        ? `${copy.feedback.timeoutPrefix} ${feedback.expected}.`
        : `${copy.feedback.wrongPrefix} ${feedback.expected}.`
    : "";
  const tipText =
    feedback && !feedback.correct && question?.tip ? question.tip : "";
  const reviewButtonLabel =
    wrongQuestionCount > 0
      ? `${copy.menu.reviewAction} (${wrongQuestionCount})`
      : copy.menu.reviewAction;
  const showNextButton = Boolean(answered && feedback && !feedback.correct);

  let content: ReactElement | null = null;

  if (screen === "menu") {

    content = (
      <>


        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{copy.menu.title}</h1>
          <p className={styles.heroText}>{copy.menu.description}</p>
          <div className={styles.menuMetaRow}>
            <div className={styles.metaBadge}>
              <span className={styles.metaBadgeText}>
                {settings.questionCount} {copy.menu.questionsSuffix}
              </span>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.metaBadgeText}>
                {settings.timeLimitSeconds}
                {copy.menu.timeSuffix}
              </span>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.metaBadgeText}>
                {copy.menu.weakestPrefix} {weaknessText}
              </span>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.metaBadgeText}>
                {copy.menu.wrongPrefix} {wrongQuestionCount}
              </span>
            </div>
          </div>
        </section>

        <div className={styles.menuGrid}>
          {modes.map((item) => (
            <button
              key={item.key}
              onClick={() => startSession(item.key)}
              type="button"
              className={styles.menuButton}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span>
                <span className={styles.menuLabel}>{item.label}</span>
                <span className={styles.menuSub}>{item.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.menuActions}>
          <button
            type="button"
            onClick={() => startSession("review")}
            disabled={wrongQuestionCount === 0}
            className={`${styles.settingsButton} ${styles.menuActionButton} ${
              wrongQuestionCount === 0 ? styles.buttonDisabled : ""
            }`}
          >
            {reviewButtonLabel}
          </button>
          <button
            type="button"
            onClick={() => setScreen("study")}
            className={`${styles.settingsButton} ${styles.menuActionButton}`}
          >
            {copy.menu.studyAction}
          </button>
          <button
            type="button"
            onClick={() => setScreen("stats")}
            className={`${styles.settingsButton} ${styles.menuActionButton}`}
          >
            {copy.menu.statsAction}
          </button>
          <button
            type="button"
            onClick={() => setScreen("settings")}
            className={`${styles.settingsButton} ${styles.menuActionButton}`}
          >
            {copy.menu.settingsAction}
          </button>
        </div>
      </>
    );
  }

  if (screen === "drill") {
    content = (
      <>
        <div className={styles.statusRow}>
          <div className={styles.statusPill}>
            <span className={styles.statusText}>
              {copy.drill.questionLabel} {questionIndex}/
              {sessionTotal}
            </span>
          </div>
          <div
            className={`${styles.statusPill} ${
              timeLeft <= 3 ? styles.statusPillWarning : ""
            }`}
          >
            <span className={styles.statusText}>
              {copy.drill.timeLabel} {timeLeftLabel}
            </span>
          </div>
        </div>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>
            {modeLabel} {copy.appBar.drillSuffix}
          </h2>
          <p className={styles.sectionSub}>{copy.drill.subtitle}</p>

          {question ? (
            <div className={styles.questionCard}>
              <div className={styles.metaRow}>
                <span className={styles.metaPill}>
                  {copy.drill.skillLabel}: {provider.skills[question.skill].label}
                </span>
                <span className={styles.metaPill}>
                  {copy.drill.focusLabel}: {question.focus}
                </span>
                <span className={styles.metaPill}>
                  {copy.drill.levelLabel} {question.level}
                </span>
                <span className={styles.metaPill}>
                  {copy.drill.targetLabel} {formatMs(provider.getTargetMs(question.level))}
                </span>
              </div>

              <div className={styles.questionText}>
                {provider.getQuestionText(question)}
              </div>

              {question.choices?.length ? (
                <div className={styles.choiceGrid}>
                  {question.choices.map((choice) => {
                    const sanitizedChoice = provider.answer.sanitizeInput(choice, {
                      allowNegative: allowNegativeAnswer,
                    });
                    const isSelected = answer === sanitizedChoice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleChoiceSelect(choice)}
                        disabled={answered}
                        className={`${styles.choiceButton} ${
                          isSelected ? styles.choiceButtonActive : ""
                        } ${answered ? styles.choiceButtonDisabled : ""}`}
                      >
                        <span className={styles.choiceButtonText}>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {showNextButton ? (
                <div className={styles.answerBlock}>
                  <div className={styles.actionRow}>
                    <button
                      type="button"
                      onClick={handleNext}
                      className={styles.secondaryButton}
                    >
                      {copy.drill.nextAction}
                    </button>
                  </div>
                </div>
              ) : null}

              {error ? <p className={styles.errorText}>{error}</p> : null}
              {feedback ? (
                <div
                  className={`${styles.feedback} ${
                    feedback.correct
                      ? styles.feedbackCorrect
                      : styles.feedbackWrong
                  }`}
                >
                  <span className={styles.feedbackText}>{feedbackText}</span>
                </div>
              ) : null}
              {tipText ? (
                <div className={styles.tipCard}>
                  <span className={styles.tipLabel}>{copy.drill.tipLabel}</span>
                  <p className={styles.tipText}>{tipText}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className={styles.sectionSub}>{copy.drill.loading}</p>
          )}

          <div className={styles.sessionRow}>
            <div>
              <p className={styles.sessionLabel}>{copy.drill.sessionScoreLabel}</p>
              <p className={styles.sessionValue}>
                {session.correct} correct / {session.wrong} wrong
              </p>
            </div>
            <p className={styles.sessionHint}>{copy.drill.sessionHint}</p>
          </div>
        </section>
      </>
    );
  }

  if (screen === "stats") {
    content = (
      <>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{copy.stats.title}</h1>
          <p className={styles.heroText}>{copy.stats.intro}</p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{copy.stats.overallTitle}</h2>
          <p className={styles.sectionSub}>{copy.stats.overallIntro}</p>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>{copy.stats.accuracyLabel}</p>
              <p className={styles.summaryValue}>{overallAccuracy}%</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>{copy.stats.attemptsLabel}</p>
              <p className={styles.summaryValue}>{allAttempts}</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>{copy.stats.avgTimeLabel}</p>
              <p className={styles.summaryValue}>
                {allAttempts ? formatMs(overallAvgMs) : "-"}
              </p>
            </div>
          </div>
          <div className={styles.statBar}>
            <div
              className={styles.statBarFill}
              style={{ width: `${overallAccuracy}%` }}
            />
          </div>
        </section>

        <div className={styles.statGrid}>
          {skillKeys.map((skill) => {
            const history = stats[skill].history;
            const accuracy = provider.getAccuracy(stats[skill]);
            const avgMs = provider.getAverageMs(stats[skill]);
            const accuracyText =
              history.length === 0
                ? copy.stats.noData
                : `${Math.round(accuracy * 100)}%`;
            const speedText = history.length === 0 ? "-" : formatMs(avgMs);
            const barWidth =
              history.length === 0 ? "0%" : `${Math.round(accuracy * 100)}%`;

            return (
              <section key={skill} className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3 className={styles.statTitle}>
                    {provider.skills[skill].label}
                  </h3>
                  <span className={styles.levelBadge}>
                    {copy.drill.levelLabel} {stats[skill].level}
                  </span>
                </div>
                <div className={styles.statBar}>
                  <div
                    className={styles.statBarFill}
                    style={{ width: barWidth }}
                  />
                </div>
                <div className={styles.statMetrics}>
                  <div>
                    <p className={styles.metricLabel}>
                      {copy.stats.accuracyLabel}
                    </p>
                    <p className={styles.metricValue}>{accuracyText}</p>
                  </div>
                  <div className={styles.metricDivider} />
                  <div>
                    <p className={styles.metricLabel}>{copy.stats.avgTimeLabel}</p>
                    <p className={styles.metricValue}>{speedText}</p>
                  </div>
                </div>
                <div className={styles.dotRow}>
                  {history.length === 0 ? (
                    <span className={styles.dotEmpty}>
                      {copy.stats.noAttempts}
                    </span>
                  ) : (
                    history.map((item, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className={`${styles.dot} ${
                          item.correct ? styles.dotCorrect : styles.dotWrong
                        }`}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </>
    );
  }

  if (screen === "study") {
    content = (
      <>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{studyConfig.title}</h1>
          <p className={styles.heroText}>{studyConfig.intro}</p>
        </section>

        <div className={styles.studyGrid}>
          {studyConfig.sections.map((section) => (
            <section key={section.title} className={styles.studyCard}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.description ? (
                <p className={styles.sectionSub}>{section.description}</p>
              ) : null}
              <ul className={styles.studyList}>
                {section.items.map((item) => (
                  <li key={item} className={styles.studyItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={goToMenu}
          className={`${styles.secondaryButton} ${styles.fullWidthButton}`}
        >
          {copy.settings.backToMenu}
        </button>
      </>
    );
  }

  if (screen === "summary") {
    content = (
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{copy.summary.title}</h2>
        <p className={styles.sectionSub}>
          {modeLabel} {copy.appBar.drillSuffix}
        </p>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>{copy.summary.accuracyLabel}</p>
            <p className={styles.summaryValue}>{accuracy}%</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>{copy.summary.correctLabel}</p>
            <p className={styles.summaryValue}>{session.correct}</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>{copy.summary.wrongLabel}</p>
            <p className={styles.summaryValue}>{session.wrong}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => startSession(mode)}
          className={styles.primaryButton}
        >
          {copy.summary.practiceAgain}
        </button>
        <button
          type="button"
          onClick={goToMenu}
          className={styles.secondaryButton}
        >
          {copy.summary.backToMenu}
        </button>
      </section>
    );
  }

  if (screen === "settings") {
    content = (
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{copy.settings.title}</h2>
        <p className={styles.sectionSub}>{copy.settings.intro}</p>

        {provider.settings.controls.map((control) => {
          const value = control.getValue(settings);
          const displayValue = control.formatValue
            ? control.formatValue(value, settings)
            : String(value);
          return (
            <div key={control.id} className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <p className={styles.settingLabel}>{control.label}</p>
                {control.hint ? (
                  <p className={styles.settingHint}>{control.hint}</p>
                ) : null}
              </div>
              <div className={styles.stepper}>
                <button
                  type="button"
                  onClick={() => adjustSetting(control.id, -1)}
                  className={styles.stepperButton}
                >
                  <span className={styles.stepperButtonText}>-</span>
                </button>
                <span className={styles.stepperValue}>{displayValue}</span>
                <button
                  type="button"
                  onClick={() => adjustSetting(control.id, 1)}
                  className={styles.stepperButton}
                >
                  <span className={styles.stepperButtonText}>+</span>
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={copy.settings.themeLabel}
          className={`${styles.themeToggle} ${
            theme === "dark" ? styles.themeToggleDark : ""
          }`}
        >
          <span className={styles.themeIcon} aria-hidden="true">
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" role="img">
                <path
                  d="M21 14.5A8.5 8.5 0 0 1 9.5 3a9 9 0 1 0 11.5 11.5Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" role="img">
                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1.6">
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.6" y1="4.6" x2="6.8" y2="6.8" />
                  <line x1="17.2" y1="17.2" x2="19.4" y2="19.4" />
                  <line x1="4.6" y1="19.4" x2="6.8" y2="17.2" />
                  <line x1="17.2" y1="6.8" x2="19.4" y2="4.6" />
                </g>
              </svg>
            )}
          </span>
          <span className={styles.themeText}>
            <span className={styles.themeLabel}>{copy.settings.themeLabel}</span>
            <span className={styles.themeName}>
              {theme === "dark" ? copy.settings.themeDark : copy.settings.themeLight}
            </span>
          </span>
          <span className={styles.themeSwitch} aria-hidden="true">
            <span className={styles.themeKnob} />
          </span>
        </button>

        <button
          type="button"
          onClick={resetStats}
          className={styles.dangerButton}
        >
          {copy.settings.resetStats}
        </button>

        <button
          type="button"
          onClick={goToMenu}
          className={`${styles.secondaryButton} ${styles.fullWidthButton}`}
        >
          {copy.settings.backToMenu}
        </button>
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <div className={styles.appBarInner}>
          <div className={styles.appBarLeft}>
            {screen === "menu" ? (
              <div className={styles.brandMark}>
                <span className={styles.brandMarkText}>
                  {copy.brand.shortName}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={goToMenu}
                className={styles.appBarBack}
                aria-label={copy.summary.backToMenu}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className={styles.appBarTitle}>{appBarTitle}</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {content}
        {inlineAdConfig.enabled ? (
          <InlineScriptAdSlot
            config={inlineAdConfig}
            className={styles.adSlot}
          />
        ) : null}
      </main>
    </div>
  );
}
