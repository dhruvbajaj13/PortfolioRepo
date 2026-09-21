import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dhruv Bajaj — Software Engineer & Creative Developer',
  description:
    'Award-winning portfolio of Dhruv Bajaj, Software Engineer, Web Developer, and AI Systems Engineer pursuing B.Tech ECE at NSUT (2027).',
  keywords: [
    'Dhruv Bajaj',
    'Software Engineer',
    'Web Developer',
    'Next.js 15',
    'AI Engineer',
    'NSUT',
    'LeetCode 1933',
  ],
  authors: [{ name: 'Dhruv Bajaj' }],
  openGraph: {
    title: 'Dhruv Bajaj — Software Engineer & Creative Developer',
    description:
      'Luxurious spatial web portfolio experience built with Next.js 15, Three.js, React Three Fiber, and Framer Motion.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#030303]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&family=Space+Grotesk:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#030303] text-[#FFFFFF] antialiased selection:bg-[#FF6B2C]/30 selection:text-[#FFFFFF]">
        {children}
      </body>
    </html>
  );
}
