'use client';

import { BookmarkIcon } from './icons/BookmarkIcon';
import { type Name } from '../data/names';
import { type BloomPrompts } from '../lib/prompts';

type NameModalProps = {
  name: Name;
  prompts: BloomPrompts;
  isBookmarked: boolean;
  position: {
    current: number;
    total: number;
  };
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onBookmarkToggle: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
};

export function NameModal({
  name,
  prompts,
  isBookmarked,
  position,
  onPrev,
  onNext,
  onClose,
  onBookmarkToggle,
  prevDisabled,
  nextDisabled,
}: NameModalProps) {
  return (
    <div className="name-modal-overlay" role="dialog" aria-modal="true" aria-labelledby={`name-${name.id}-title`}>
      <div className="name-modal">
        <div className="name-modal-controls">
          <button
            className={`bookmark-toggle ${isBookmarked ? 'active' : ''}`}
            onClick={onBookmarkToggle}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this name'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this name'}
          >
            <BookmarkIcon filled={isBookmarked} />
          </button>
          <button className="modal-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </div>
        {name.image ? (
          <div className="name-modal-media">
            <img src={name.image} alt={`${name.transliteration_en} illustration`} />
          </div>
        ) : (
          <div className="name-modal-media placeholder">
            <span role="img" aria-label="Lotus">
              🪷
            </span>
          </div>
        )}
        <div className="name-modal-header">
          <span className="name-modal-number">#{name.id}</span>
          <div className="name-modal-names">
            <div id={`name-${name.id}-title`} className="name-modal-name-te">{name.telugu_name}</div>
            <div className="name-modal-name-en">{name.transliteration_en}</div>
          </div>
          {isBookmarked && (
            <div className="name-modal-badges">
              <span className="name-modal-badge bookmarked">Bookmarked</span>
            </div>
          )}
        </div>
        <div className="name-modal-meanings">
          <p className="card-meaning">{name.english_meaning}</p>
          {name.meaning_te && <p className="card-meaning-te">{name.meaning_te}</p>}
        </div>
        <div className="name-modal-sections">
          <div className="card-section">
            <h4>Scriptural Essence · Remember</h4>
            <p>{prompts.remember}</p>
          </div>
          <div className="card-section">
            <h4>Contemplation · Understand</h4>
            <p>{prompts.understand}</p>
          </div>
          <div className="card-section">
            <h4>Sadhana · Apply</h4>
            <p>{prompts.apply}</p>
          </div>
        </div>
        <div className="name-modal-footer">
          <button className="btn footer-nav" onClick={onPrev} disabled={prevDisabled}>
            ← Previous
          </button>
          <div className="modal-progress">
            {position.current}/{position.total}
          </div>
          <button className="btn footer-nav" onClick={onNext} disabled={nextDisabled}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
