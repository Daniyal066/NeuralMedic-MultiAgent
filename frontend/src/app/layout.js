import React from 'react';
import './globals.css';
import Navigation from './Navigation';

export const metadata = {
  title: 'NeuralMedic | Patient Health Portal',
  description: 'Your intelligent health companion powered by multi-agent AI. Manage appointments, records, prescriptions, and more.',
  keywords: 'patient portal, healthcare, AI medical, health records, appointments',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
