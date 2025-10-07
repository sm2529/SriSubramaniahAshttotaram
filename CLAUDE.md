# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A devotional Next.js application for learning Subramaniah Swamy Ashtottaram - 108 sacred names of Lord Subramaniah (Murugan/Kartikeya). The app provides Telugu names with English transliterations and meanings, organized into lessons of 10 names each for better learning progression.

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture & Key Components

### Data Management
- **`data/names.json`**: Contains 108 sacred names with structure:
  ```typescript
  {
    id: number;
    telugu_name: string;
    transliteration_en: string; 
    english_meaning: string;
    meaning_te?: string;
    audio_url?: string | null;
  }
  ```
- **`src/data/names.ts`**: TypeScript wrapper and utilities for name data access

### Core Libraries (`src/lib/`)
- **`chunking.ts`**: Lesson segmentation logic (10 names per lesson)
  - `CHUNK_SIZE = 10` constant
  - Functions: `getLessonCount()`, `getLessonRange()`, `getLessonLabel()`
- **`progress.ts`**: LocalStorage-based progress tracking
  - Tracks mastered names and view timestamps
  - Functions: `markSeen()`, `markMastered()`, `isMastered()`, `countMastered()`
  - Storage key: `'ashtottara_progress_v1'`

### App Structure (Next.js 14 App Router)
- **`app/layout.tsx`**: Root layout with navigation (Home/Challenge links)
- Uses App Router pattern with TypeScript strict mode enabled
- Global CSS styling in `app/globals.css`

### Technology Stack
- **Next.js 14** with React 18
- **TypeScript** with strict configuration
- **App Router** architecture
- Client-side state management via localStorage
- No external UI libraries (custom CSS styling)

## Key Patterns
- **Lesson-based learning**: Names grouped in chunks of 10 for digestible learning
- **Progress persistence**: All user progress saved locally via localStorage
- **Bilingual support**: Telugu script with English transliterations and meanings
- **Sacred content handling**: Respectful presentation of religious/devotional material

## Project Configuration
- TypeScript target: ES2021 with DOM libraries
- Next.js with React Strict Mode enabled
- Base URL set to project root for absolute imports
- No path mapping configured (uses relative imports)