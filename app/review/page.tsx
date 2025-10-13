'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { names } from '../../src/data/names';
import { NameModal } from '../../src/components/NameModal';
import { BookmarkIcon } from '../../src/components/icons/BookmarkIcon';
import { CHUNK_SIZE } from '../../src/lib/chunking';
import { type Progress, getProgress, markSeen, toggleBookmark } from '../../src/lib/progress';
import { getBloomPrompts } from '../../src/lib/prompts';

export default function ReviewPage() {
  const [progress, setProgress] = useState<Progress>({ mastered: {}, seen: {}, bookmarked: {} });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const bookmarkedNames = useMemo(
    () => names.filter((name) => progress.bookmarked[name.id]),
    [progress.bookmarked],
  );

  const expandedName = expandedId ? bookmarkedNames.find((name) => name.id === expandedId) : undefined;
  const expandedPrompts = expandedName ? getBloomPrompts(expandedName) : null;
  const expandedIndex = expandedName ? bookmarkedNames.findIndex((name) => name.id === expandedName.id) : -1;
  const modalPosition = expandedIndex >= 0 ? expandedIndex + 1 : 0;

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

  const handleExpand = (nameId: number) => {
    setExpandedId(nameId);
  };

  const handleClose = () => {
    setExpandedId(null);
  };

  const handleBookmarkToggle = () => {
    if (!expandedName) return;
    toggleBookmark(expandedName.id);
    const latest = getProgress();
    setProgress(latest);
    if (!latest.bookmarked[expandedName.id]) {
      setExpandedId(null);
    }
  };

  const handleModalNav = (direction: 'prev' | 'next') => {
    if (expandedIndex === -1) return;
    const targetIndex = direction === 'next' ? expandedIndex + 1 : expandedIndex - 1;
    if (targetIndex < 0 || targetIndex >= bookmarkedNames.length) return;
    setExpandedId(bookmarkedNames[targetIndex].id);
  };

  const totalBookmarks = bookmarkedNames.length;

  return (
    <main className="main list-mode review-mode">
      <div className="lesson-header review-header">
        <h1>Bookmarked Review</h1>
        <p className="lesson-range">
          {totalBookmarks === 0
            ? 'No names saved yet — bookmark names in lessons to collect them here.'
            : `${totalBookmarks} sacred name${totalBookmarks === 1 ? '' : 's'} ready for focused contemplation.`}
        </p>
        <Link className="btn secondary" href="/">
          ← Back to Lessons
        </Link>
      </div>

      {totalBookmarks > 0 ? (
        <section className="lesson-names-section">
          <div className="lesson-names-header">
            <h3>Your bookmarked names</h3>
            <p>Open each to revisit the remember, understand, and apply layers.</p>
          </div>
          <div className="lesson-name-list">
            {bookmarkedNames.map((name) => {
              const isSeen = !!progress.seen[name.id];
              const status = isSeen ? 'seen' : 'new';
              const lessonNumber = Math.ceil(name.id / CHUNK_SIZE);
              const statusLabel = isSeen ? 'Seen' : 'New';
              return (
                <div
                  key={name.id}
                  className={`lesson-name-card ${status} bookmarked`}
                  onClick={() => handleExpand(name.id)}
                >
                  <div className="lesson-name-main">
                    <span className="lesson-name-index">{name.id}</span>
                    <div className="lesson-name-text">
                      <div className="lesson-name-te">{name.telugu_name}</div>
                      <div className="lesson-name-en">{name.transliteration_en}</div>
                    </div>
                  </div>
                  <div className="lesson-name-actions">
                    <span className="lesson-name-status">
                      Lesson {lessonNumber} · {statusLabel}
                      <BookmarkIcon filled className="status-bookmark-icon" />
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
      ) : (
        <section className="bookmark-empty">
          <div className="bookmark-empty-card">
            <p>When a name needs more attention, tap the star in its modal. Everything you flag will gather here.</p>
            <Link className="btn primary" href="/">
              Explore Lessons
            </Link>
          </div>
        </section>
      )}

      {expandedName && expandedPrompts && (
        <NameModal
          name={expandedName}
          prompts={expandedPrompts}
          isBookmarked={true}
          position={{ current: modalPosition, total: bookmarkedNames.length }}
          onPrev={() => handleModalNav('prev')}
          onNext={() => handleModalNav('next')}
          onClose={handleClose}
          onBookmarkToggle={handleBookmarkToggle}
          prevDisabled={expandedIndex <= 0}
          nextDisabled={expandedIndex === bookmarkedNames.length - 1}
        />
      )}
    </main>
  );
}
