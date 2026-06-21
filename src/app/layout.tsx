import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import TickerTape from '@/components/TickerTape';
import Tutorial from '@/components/Tutorial';
import ThemeProvider from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'MarketSim Pro — Trade Like a Pro. Risk Nothing.',
  description: 'Professional-grade stock market simulator with real live market data, simulation mode, AI predictions, and leaderboards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex' }}>
        <AuthProvider>
        <ThemeProvider />
        <Tutorial />
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'auto' }}>
          <Topbar />
          <TickerTape />
          <main style={{ flex: 1, padding: 24 }}>
            {children}
          </main>
          <footer style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border)',
            fontSize: '0.7rem', color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            MarketSim Pro is a simulation platform for educational purposes only. No real trades are executed. Not financial advice.
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
