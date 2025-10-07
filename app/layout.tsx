import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Subramaniah Swamy Ashtottaram',
  description: 'Learn the 108 sacred names (Telugu + transliteration + meaning)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div>
              <div className="title">🦚 Subrahmanya Ashtottara</div>
              <div className="subtitle">108 sacred names • lessons in 10s</div>
            </div>
            <nav>
              <a href="/" className="btn">Home</a>
              <a href="/challenge" className="btn" style={{ marginLeft: 8 }}>Challenge</a>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div className="footer-content">
              <p className="footer-creator">Created by Suma Mandalapu</p>
              <p className="footer-copyright">© {new Date().getFullYear()} Subrahmanya Ashtottara. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
