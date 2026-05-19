import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { initDb } from '@/lib/db';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Gusto & Co. | Alta Gastronomia Contemporânea',
  description: 'Gusto & Co. oferece uma experiência gastronômica premium, com cardápio exclusivo, reservas de mesas interativas e delivery de pratos autorais.',
  keywords: 'restaurante, alta gastronomia, reservas de mesa, delivery de comida, jantar de luxo, São Paulo',
};

export default async function RootLayout({ children }) {
  // Inicialização silenciosa do banco de dados na inicialização do servidor
  try {
    await initDb();
  } catch (error) {
    console.error('Erro na inicialização automática do banco no layout:', error);
  }

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${playfair.variable}`}>
      <body style={{ paddingTop: '80px' }}>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
