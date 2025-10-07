'use client';

import { names } from '../src/data/names';
import { getLessonCount, getLessonLabel } from '../src/lib/chunking';
import { getProgress, markSeen, markMastered, isMastered, countMastered, countSeen, getNameState } from '../src/lib/progress';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [showOverview, setShowOverview] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState<{ mastered: Record<number, boolean>; seen: Record<number, number> }>({ mastered: {}, seen: {} });
  
  const totalLessons = getLessonCount(names.length);
  const lessonStart = (currentLesson - 1) * 10;
  const lessonEnd = Math.min(currentLesson * 10, names.length);
  const lessonNames = names.slice(lessonStart, lessonEnd);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const handleMarkMastered = (id: number) => {
    const wasAlreadyMastered = isMastered(id);
    markMastered(id);
    const newProgress = getProgress();
    setProgress(newProgress);
    
    if (!wasAlreadyMastered) {
      const newMasteredCount = countMastered(lessonNames.map(n => n.id));
      if (newMasteredCount === lessonNames.length) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const handleCardClick = (id: number) => {
    // Toggle expanded state
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        // Mark as seen when first expanded
        if (!progress.seen[id]) {
          markSeen(id);
          setProgress(getProgress());
        }
      }
      return newSet;
    });
  };

  const masteredCount = countMastered(lessonNames.map(n => n.id));
  const seenCount = countSeen(lessonNames.map(n => n.id));

  const getLessonStats = (lessonNum: number) => {
    const start = (lessonNum - 1) * 10;
    const end = Math.min(lessonNum * 10, names.length);
    const lessonIds = names.slice(start, end).map(n => n.id);
    return {
      mastered: countMastered(lessonIds),
      seen: countSeen(lessonIds),
      total: lessonIds.length
    };
  };

  const totalMastered = countMastered(names.map(n => n.id));
  const overallProgress = Math.round((totalMastered / names.length) * 100);

  return (
    <main className="main">
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <div className="celebration-emoji">🎉</div>
            <h2>Lesson {currentLesson} Complete!</h2>
            <p>Great job! You've mastered all names in this lesson.</p>
            {currentLesson < totalLessons && (
              <button 
                className="btn primary"
                onClick={() => {
                  setCurrentLesson(currentLesson + 1);
                  setShowCelebration(false);
                }}
              >
                Continue to Lesson {currentLesson + 1} →
              </button>
            )}
            {currentLesson === totalLessons && (
              <div className="final-celebration">
                <p><strong>🏆 Congratulations! You've completed all 108 sacred names!</strong></p>
                <p>Overall Progress: {overallProgress}% mastered</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="lesson-header">
        <h1>Lesson {currentLesson} of {totalLessons}</h1>
        <p className="lesson-range">Names {getLessonLabel(currentLesson, names.length)}</p>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill seen" 
              style={{ width: `${(seenCount / lessonNames.length) * 100}%` }}
            />
            <div 
              className="progress-fill mastered" 
              style={{ width: `${(masteredCount / lessonNames.length) * 100}%` }}
            />
          </div>
          <div className="progress-stats">
            <span className="progress-text seen">{seenCount}/{lessonNames.length} viewed</span>
            <span className="progress-text mastered">{masteredCount}/{lessonNames.length} mastered</span>
          </div>
        </div>
      </div>

      <div className="lesson-nav">
        <button 
          className="btn" 
          disabled={currentLesson === 1}
          onClick={() => setCurrentLesson(currentLesson - 1)}
        >
          ← Previous
        </button>
        <button 
          className="btn primary" 
          onClick={() => setShowOverview(!showOverview)}
        >
          {showOverview ? 'Hide Overview' : 'Lesson Overview'}
        </button>
        <button 
          className="btn"
          disabled={currentLesson === totalLessons}
          onClick={() => setCurrentLesson(currentLesson + 1)}
        >
          Next →
        </button>
      </div>

      {showOverview && (
        <div className="lesson-overview">
          <h3>All Lessons Progress</h3>
          <div className="lesson-grid">
            {Array.from({ length: totalLessons }, (_, i) => i + 1).map(lessonNum => {
              const stats = getLessonStats(lessonNum);
              const isComplete = stats.mastered === stats.total;
              const isStarted = stats.seen > 0;
              return (
                <div 
                  key={lessonNum}
                  className={`lesson-card ${lessonNum === currentLesson ? 'current' : ''} ${isComplete ? 'complete' : ''} ${isStarted ? 'started' : ''}`}
                  onClick={() => {
                    setCurrentLesson(lessonNum);
                    setShowOverview(false);
                  }}
                >
                  <div className="lesson-number">Lesson {lessonNum}</div>
                  <div className="lesson-range">{getLessonLabel(lessonNum, names.length)}</div>
                  <div className="lesson-progress">
                    <div className="mini-progress-bar">
                      <div 
                        className="mini-progress-fill mastered"
                        style={{ width: `${(stats.mastered / stats.total) * 100}%` }}
                      />
                    </div>
                    <div className="lesson-stats">
                      {stats.mastered}/{stats.total} mastered
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="names-list">
        {lessonNames.map((name) => {
          const nameState = getNameState(name.id);
          const isExpanded = expandedCards.has(name.id);
          return (
          <div 
            key={name.id} 
            className={`name-card list-style ${nameState} ${isExpanded ? 'expanded' : ''}`}
            onClick={() => handleCardClick(name.id)}
          >
            <div className="name-header">
              <div className="name-number">{name.id}</div>
              <div className="name-content">
                <div className="name-telugu">{name.telugu_name}</div>
                <div className="name-transliteration">{name.transliteration_en}</div>
              </div>
              <div className="expand-indicator">
                {isExpanded ? '▼' : '▶'}
              </div>
            </div>
            
            {isExpanded && (
              <div className="name-meanings">
                <div className="name-meaning">{name.english_meaning}</div>
                {name.meaning_te && (
                  <div className="name-meaning-te">{name.meaning_te}</div>
                )}
                <button 
                  className={`mastery-btn ${isMastered(name.id) ? 'mastered' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkMastered(name.id);
                  }}
                >
                  {isMastered(name.id) ? '✓ Mastered' : 'Mark Mastered'}
                </button>
              </div>
            )}
          </div>
        );
        })}
      </div>
    </main>
  );
}