import type { Metadata } from 'next';
import { Cairo, Geist } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PureX | خدمات نظافة فندقية للشقق والفلل - CyberX',
  description:
    'منظومة PureX للنظافة والتعقيم الفندقي الفاخر للشقق والفلل والمقرات الإدارية. حاسبة أسعار تفاعلية، كوادر أمنية معتمدة، تعقيم بالبخار الجاف 180°C ومحضر تسليم رقمي.',
  keywords: [
    'PureX',
    'CyberX',
    'نظافة فندقية',
    'تنظيف فلل التجمع الخامس',
    'تنظيف شقق الشيخ زايد',
    'تعقيم بالبخار الجاف',
    'تنظيف بعد التشطيب',
    'حاسبة اسعار النظافة',
  ],
  authors: [{ name: 'CyberX Platform' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${geistSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-[family-name:var(--font-cairo),Arial,sans-serif]">
        {children}
      </body>
    </html>
  );
}
