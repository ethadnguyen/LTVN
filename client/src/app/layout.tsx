import './globals.css';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTopButton from '../components/ScrollToTopButton';
import StoreProvider from '@/providers/StoreProvider';
import { CartProvider } from '@/providers/CartProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TechBuild - Custom PC Builder',
  description: 'Build your custom PC with our drag-and-drop interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <StoreProvider>
          <CartProvider>
            <div className='flex flex-col min-h-screen'>
              <Header />
              <main className='flex-grow'>{children}</main>
              <Footer />
            </div>
            <Toaster />
            <ScrollToTopButton />
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
