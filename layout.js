import './globals.css';

export const metadata = {
  title: 'Whack-a-Mole',
  description: 'A tiny whack-a-mole game',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
