'use client';

import { names } from '../../src/data/names';
import { getProgress, markMastered, getNameState, isMastered, countMastered } from '../../src/lib/progress';
import { getLessonCount, getLessonLabel } from '../../src/lib/chunking';
import { useState, useEffect } from 'react';

type ChallengeMode = 'multiple-choice' | 'fill-blank' | 'meaning-to-name';

export default function ChallengePage() {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [currentName, setCurrentName] = useState(names[0]);
  const [mode, setMode] = useState<ChallengeMode>('multiple-choice');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [options, setOptions] = useState<Array<{text: string, isCorrect: boolean}>>([]);
  const [availableNames, setAvailableNames] = useState<typeof names>([]);
  const [progress, setProgress] = useState<{ mastered: Record<number, boolean>; seen: Record<number, number> }>({ mastered: {}, seen: {} });

  const totalLessons = getLessonCount(names.length);

  useEffect(() => {
    setProgress(getProgress());
    updateAvailableNames();
  }, [currentLesson]);

  useEffect(() => {
    if (availableNames.length > 0) {
      nextQuestion();
    }
  }, [availableNames, mode]);

  const updateAvailableNames = () => {
    // Get names from current lesson + all previous lessons
    const maxNameId = currentLesson * 10;
    const available = names.filter(name => name.id <= maxNameId);
    setAvailableNames(available);
  };

  const getRandomName = () => {
    if (availableNames.length === 0) return names[0];
    
    // Smart selection: 70% from current lesson, 30% from previous lessons
    const currentLessonStart = (currentLesson - 1) * 10 + 1;
    const currentLessonEnd = currentLesson * 10;
    
    const currentLessonNames = availableNames.filter(
      name => name.id >= currentLessonStart && name.id <= currentLessonEnd
    );
    const previousNames = availableNames.filter(
      name => name.id < currentLessonStart
    );
    
    // 70% chance for current lesson names, 30% for review
    const useCurrentLesson = Math.random() < 0.7 || previousNames.length === 0;
    const sourcePool = useCurrentLesson ? currentLessonNames : previousNames;
    
    if (sourcePool.length === 0) return availableNames[0];
    
    const randomIndex = Math.floor(Math.random() * sourcePool.length);
    return sourcePool[randomIndex];
  };

  const generateMultipleChoiceOptions = (correctName: typeof names[0]) => {
    // Get smart distractors from available names (not future lessons)
    const incorrectOptions = availableNames
      .filter(n => n.id !== correctName.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(n => ({ text: n.english_meaning, isCorrect: false }));
    
    const correctOption = { text: correctName.english_meaning, isCorrect: true };
    
    const allOptions = [...incorrectOptions, correctOption]
      .sort(() => Math.random() - 0.5);
    
    return allOptions;
  };

  const nextQuestion = () => {
    const newName = getRandomName();
    setCurrentName(newName);
    setShowAnswer(false);
    setSelectedOption(null);
    
    if (mode === 'multiple-choice') {
      setOptions(generateMultipleChoiceOptions(newName));
    }
  };

  const handleCorrect = () => {
    setScore(score + 1);
    setTotal(total + 1);
    markMastered(currentName.id);
    setProgress(getProgress());
    setTimeout(nextQuestion, 1500); // Brief delay to show feedback
  };

  const handleIncorrect = () => {
    setTotal(total + 1);
    setTimeout(nextQuestion, 1500); // Brief delay to show feedback
  };

  const handleOptionSelect = (optionIndex: number, isCorrect: boolean) => {
    setSelectedOption(optionIndex);
    setShowAnswer(true);
    
    if (isCorrect) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  };

  const renderQuestion = () => {
    switch (mode) {
      case 'multiple-choice':
        return (
          <div className="question">
            <div className="question-header">
              <div className="question-number">#{currentName.id}</div>
              <div className="question-lesson">Lesson {Math.ceil(currentName.id / 10)}</div>
            </div>
            <div className="question-text">{currentName.telugu_name}</div>
            <div className="question-sub">({currentName.transliteration_en})</div>
            <p>What does this name mean?</p>
            <div className="options-grid">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${
                    selectedOption === index 
                      ? (option.isCorrect ? 'correct' : 'incorrect')
                      : ''
                  } ${showAnswer && option.isCorrect ? 'show-correct' : ''}`}
                  onClick={() => !showAnswer && handleOptionSelect(index, option.isCorrect)}
                  disabled={showAnswer}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        );
      case 'meaning-to-name':
        return (
          <div className="question">
            <div className="question-text">{currentName.english_meaning}</div>
            <p>Which name has this meaning?</p>
          </div>
        );
      case 'fill-blank':
        return (
          <div className="question">
            <div className="question-text">{currentName.telugu_name}</div>
            <div className="question-sub">({currentName.transliteration_en})</div>
            <p>Complete the meaning: {currentName.english_meaning.split(' ').slice(0, -1).join(' ')} ___</p>
          </div>
        );
    }
  };

  const renderAnswer = () => {
    return (
      <div className="answer">
        <div className="name-card">
          <div className="name-telugu">{currentName.telugu_name}</div>
          <div className="name-transliteration">{currentName.transliteration_en}</div>
          <div className="name-meaning">{currentName.english_meaning}</div>
          {currentName.meaning_te && (
            <div className="name-meaning-te">{currentName.meaning_te}</div>
          )}
        </div>
        <div className="challenge-actions">
          <button className="btn success" onClick={handleCorrect}>
            ✓ I got it right
          </button>
          <button className="btn" onClick={handleIncorrect}>
            ✗ I missed it
          </button>
        </div>
      </div>
    );
  };

  // Calculate lesson-specific stats
  const currentLessonStart = (currentLesson - 1) * 10 + 1;
  const currentLessonEnd = Math.min(currentLesson * 10, names.length);
  const currentLessonNames = names.slice(currentLessonStart - 1, currentLessonEnd);
  const lessonMastered = countMastered(currentLessonNames.map(n => n.id));
  const totalMastered = Object.keys(progress.mastered).length;
  const accuracyPercent = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <main className="main">
      <div className="challenge-header">
        <h1>Challenge Mode</h1>
        <div className="lesson-selector">
          <h2>Lesson {currentLesson} of {totalLessons}</h2>
          <p>Names {getLessonLabel(currentLesson, names.length)} + Review</p>
          <div className="lesson-controls">
            <button 
              className="btn"
              disabled={currentLesson === 1}
              onClick={() => setCurrentLesson(currentLesson - 1)}
            >
              ← Previous
            </button>
            <span className="lesson-progress">
              {lessonMastered}/{currentLessonNames.length} mastered
            </span>
            <button 
              className="btn"
              disabled={currentLesson === totalLessons}
              onClick={() => setCurrentLesson(currentLesson + 1)}
            >
              Next →
            </button>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-value">{score}/{total}</div>
            <div className="stat-label">Session Score</div>
          </div>
          <div className="stat">
            <div className="stat-value">{accuracyPercent}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalMastered}/108</div>
            <div className="stat-label">Total Mastered</div>
          </div>
        </div>
      </div>

      <div className="mode-selector">
        <button 
          className={`btn ${mode === 'multiple-choice' ? 'active' : ''}`}
          onClick={() => setMode('multiple-choice')}
        >
          Multiple Choice
        </button>
        <button 
          className={`btn ${mode === 'meaning-to-name' ? 'active' : ''}`}
          onClick={() => setMode('meaning-to-name')}
        >
          Meaning → Name
        </button>
        <button 
          className={`btn ${mode === 'fill-blank' ? 'active' : ''}`}
          onClick={() => setMode('fill-blank')}
        >
          Fill the Blank
        </button>
      </div>

      <div className="challenge-content">
        {mode === 'multiple-choice' ? (
          renderQuestion()
        ) : (
          !showAnswer ? (
            <>
              {renderQuestion()}
              <button className="btn primary" onClick={() => setShowAnswer(true)}>
                Show Answer
              </button>
            </>
          ) : (
            renderAnswer()
          )
        )}
      </div>
    </main>
  );
}