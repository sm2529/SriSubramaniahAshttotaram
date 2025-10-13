'use client';

import { useEffect, useState } from 'react';

import { names } from '../src/data/names';
import { CHUNK_SIZE, getLessonCount, getLessonLabel, getLessonRange } from '../src/lib/chunking';
import { NameModal } from '../src/components/NameModal';
import { BookmarkIcon } from '../src/components/icons/BookmarkIcon';
import { type Progress, getProgress, markSeen, toggleBookmark } from '../src/lib/progress';
import { getBloomPrompts } from '../src/lib/prompts';

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>({ mastered: {}, seen: {}, bookmarked: {} });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const totalLessons = getLessonCount(names.length);
  const currentLesson = Math.floor(currentIndex / CHUNK_SIZE) + 1;
  const { start, end } = getLessonRange(currentLesson, names.length);
  const lessonNames = names.slice(start, end);
  const lessonPosition = currentIndex - start + 1;

  const expandedName = expandedId ? names.find((name) => name.id === expandedId) : undefined;
  const expandedPrompts = expandedName ? getBloomPrompts(expandedName) : null;

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  useEffect(() => {
    if (!expandedName) return;
    const latest = getProgress();
    if (!latest.seen[expandedName.id]) {
      markSeen(expandedName.id);
      setProgress(getProgress());
    } else {
      setProgress(latest);
    }
  }, [expandedName?.id]);

  if (lessonNames.length === 0) {
    return null;
  }

  const lessonIds = lessonNames.map((name) => name.id);
  const seenCount = lessonIds.reduce((acc, id) => acc + (progress.seen[id] ? 1 : 0), 0);
  const expandedLessonIndex = expandedName ? lessonNames.findIndex((name) => name.id === expandedName.id) : -1;
  const expandedIsBookmarked = expandedName ? !!progress.bookmarked[expandedName.id] : false;
  const modalPosition = expandedLessonIndex >= 0 ? expandedLessonIndex + 1 : 0;

  const handleExpand = (nameId: number) => {
    const globalIndex = names.findIndex((name) => name.id === nameId);
    if (globalIndex !== -1) {
      setCurrentIndex(globalIndex);
    }
    setExpandedId(nameId);
  };

  const closeModal = () => {
    setExpandedId(null);
  };

  const handleBookmarkToggle = () => {
    if (!expandedName) return;
    toggleBookmark(expandedName.id);
    setProgress(getProgress());
  };

  const handleModalNav = (direction: 'prev' | 'next') => {
    if (expandedLessonIndex === -1) return;
    const targetIndex = direction === 'next' ? expandedLessonIndex + 1 : expandedLessonIndex - 1;
    if (targetIndex < 0 || targetIndex >= lessonNames.length) return;
    handleExpand(lessonNames[targetIndex].id);
  };

  const handleNext = () => {
    if (currentIndex === names.length - 1) return;
    const nextIndex = Math.min(currentIndex + 1, names.length - 1);
    setCurrentIndex(nextIndex);
    setExpandedId(names[nextIndex].id);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    setExpandedId(names[prevIndex].id);
  };

  const handleLessonSelect = (lessonNum: number) => {
    const { start: lessonStart } = getLessonRange(lessonNum, names.length);
    setCurrentIndex(lessonStart);
    setShowOverview(false);
    setExpandedId(names[lessonStart].id);
  };

  const getLessonStats = (lessonNum: number) => {
    const { start: rangeStart, end: rangeEnd } = getLessonRange(lessonNum, names.length);
    const ids = names.slice(rangeStart, rangeEnd).map((name) => name.id);
    return {
      seen: ids.reduce((acc, id) => acc + (progress.seen[id] ? 1 : 0), 0),
      total: ids.length,
    };
  };

  const atFirstCard = currentIndex === 0;
  const atLastCard = currentIndex === names.length - 1;

  return (
    <main className="main list-mode">

      <div className="lesson-header">
        <h1>Lesson {currentLesson} of {totalLessons}</h1>
        <p className="lesson-range">
          Names {getLessonLabel(currentLesson, names.length)} · Card {lessonPosition} of {lessonNames.length}
        </p>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill seen" style={{ width: `${(seenCount / lessonNames.length) * 100}%` }} />
          </div>
          <div className="progress-stats">
            <span className="progress-text seen">{seenCount}/{lessonNames.length} viewed</span>
          </div>
        </div>
      </div>

      <div className="lesson-nav">
        <button className="btn" disabled={atFirstCard} onClick={handlePrev}>
          ← Previous
        </button>
        <button className="btn primary" onClick={() => setShowOverview((value) => !value)}>
          {showOverview ? 'Hide Overview' : 'Lesson Overview'}
        </button>
        <button className="btn" disabled={atLastCard} onClick={handleNext}>
          Next →
        </button>
      </div>

      {showOverview && (
        <div className="lesson-overview">
          <h3>All Lessons Progress</h3>
          <div className="lesson-grid">
            {Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNum) => {
              const stats = getLessonStats(lessonNum);
              const isComplete = stats.seen === stats.total;
              const isStarted = stats.seen > 0;
              return (
                <div
                  key={lessonNum}
                  className={`lesson-card ${lessonNum === currentLesson ? 'current' : ''} ${isComplete ? 'complete' : ''} ${
                    isStarted ? 'started' : ''
                  }`}
                  onClick={() => handleLessonSelect(lessonNum)}
                >
                  <div className="lesson-number">Lesson {lessonNum}</div>
                  <div className="lesson-range">{getLessonLabel(lessonNum, names.length)}</div>
                  <div className="lesson-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill seen" style={{ width: `${(stats.seen / stats.total) * 100}%` }} />
                    </div>
                    <div className="lesson-stats">
                      {stats.seen}/{stats.total} viewed
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <section className="lesson-names-section">
        <div className="lesson-names-header">
          <h3>Names in this lesson</h3>
          <p>Browse the list and tap expand to steep in each layer.</p>
        </div>
        <div className="lesson-name-list">
          {lessonNames.map((name, index) => {
            const globalIndex = start + index;
            const status = progress.seen[name.id] ? 'seen' : 'new';
            const isActive = currentIndex === globalIndex;
            const isBookmarked = !!progress.bookmarked[name.id];
            const statusLabel = status === 'seen' ? 'Seen' : 'New';
            return (
              <div
                key={name.id}
                className={`lesson-name-card ${status} ${isActive ? 'active' : ''} ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => handleExpand(name.id)}
              >
                <div className="lesson-name-main">
                  <span className="lesson-name-index">{globalIndex + 1}</span>
                  <div className="lesson-name-text">
                    <div className="lesson-name-te">{name.telugu_name}</div>
                    <div className="lesson-name-en">{name.transliteration_en}</div>
                  </div>
                </div>
                <div className="lesson-name-actions">
                  <span className="lesson-name-status">
                    {statusLabel}
                    {isBookmarked && <BookmarkIcon filled className="status-bookmark-icon" />}
                  </span>
                  <button
                    className="btn secondary expand-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleExpand(name.id);
                    }}
                  >
                    Expand
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {expandedName && expandedPrompts && (
        <NameModal
          name={expandedName}
          prompts={expandedPrompts}
          isBookmarked={expandedIsBookmarked}
          position={{ current: modalPosition, total: lessonNames.length }}
          onPrev={() => handleModalNav('prev')}
          onNext={() => handleModalNav('next')}
          onClose={closeModal}
          onBookmarkToggle={handleBookmarkToggle}
          prevDisabled={expandedLessonIndex <= 0}
          nextDisabled={expandedLessonIndex === lessonNames.length - 1}
        />
      )}
    </main>
  );
}
