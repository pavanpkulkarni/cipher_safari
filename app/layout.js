import './globals.css'

export const metadata = {
  title: 'Cipher Safari: The Changing Skies',
  description: 'A kids cryptography adventure game inspired by Alan Turing — decode the limericks, calibrate the season and shadow rotors, and plug the glowing vines to save the animals!',
  keywords: 'cipher, safari, kids game, alan turing, cryptography, puzzle, educational',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Outfit:wght@300;400;600;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-black overflow-hidden">
        {children}
      </body>
    </html>
  )
}
