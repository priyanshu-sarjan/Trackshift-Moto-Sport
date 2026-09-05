import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ApexIntel | AI Motorsport Energy & Overtake Intelligence',
  description: 'Enterprise telemetry mining and deterministic multi-lap battery deployment optimization platform for Grand Prix racing.',
  keywords: ['F1 Telemetry', 'Motorsport AI', 'ERS Strategy', 'Overtake Corridor', 'Grand Prix Intelligence'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-obsidian-900 text-slate-100 antialiased selection:bg-cyan-400 selection:text-obsidian-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
