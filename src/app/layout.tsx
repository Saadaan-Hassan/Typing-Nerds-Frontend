import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/lib/context/auth-context';
import { CompetitionProvider } from '@/lib/context/competition-context';
import { AuthGuard } from '@/components/auth/auth-gaurd';
import { Navbar } from '@/components/common/navbar';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TypingNerds - Improve Your Typing Speed and Accuracy',
  description:
    'Practice typing, compete with others, and track your progress with our innovative typing platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5L25ZRDK');
          `}
        </Script>

        {/* HubSpot Chat Widget */}
        <Script
          id="hubspot-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              <!-- Start of HubSpot Chat Widget -->
              <script type="text/javascript" id="hs-script-loader" async defer src="//js-na1.hs-scripts.com/242688397.js"></script>
              <!-- End of HubSpot Chat Widget -->
            `,
          }}
        />

        {/* Google Analytics 4 (GA4) */}
        <Script id="google-analytics-ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-004SP1QRSS');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-004SP1QRSS"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5L25ZRDK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <AuthProvider>
          <CompetitionProvider>
            <AuthGuard>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </AuthGuard>
          </CompetitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
