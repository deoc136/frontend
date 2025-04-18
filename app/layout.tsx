import './globals.css';
import type { Metadata } from 'next';
import { Lato, Poppins } from 'next/font/google';
import Provider from '@/app/provider';
import { Side, applyAxiosConfig } from '@/config/axios-config';
import PatientHeader from './patient/components/PatientHeader';
import PatientFooter from './patient/components/PatientFooter';
import awsconfig from '@/src/aws-exports';
import Script from 'next/script'; // Import the Script component

const lato = Lato({
   subsets: ['latin'],
   weight: ['400', '300', '700'],
   display: 'swap',
   variable: '--font-lato',
});
const poppins = Poppins({
   subsets: ['latin'],
   display: 'swap',
   weight: ['300', '400', '500', '600', '700', '800'],
   variable: '--font-poppins',
});

applyAxiosConfig(Side.server);

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html
         className={`${poppins.variable} ${lato.variable} scroll-smooth`}
         lang="es"
      >
         <head />
         <body className="relative min-h-screen">
            {/* Google Analytics Script */}
            <Script
               src="https://www.googletagmanager.com/gtag/js?id=G-85QRTMK0C4"
               strategy="afterInteractive"
            />
            <Script
               id="google-analytics"
               strategy="afterInteractive"
               dangerouslySetInnerHTML={{
                  __html: `
                     window.dataLayer = window.dataLayer || [];
                     function gtag(){dataLayer.push(arguments);}
                     gtag('js', new Date());
                     gtag('config', 'G-85QRTMK0C4');
                  `,
               }}
            />
            <Provider>
               <main className="relative">
                  <div
                     id="patient-body"
                     className="grid min-h-screen grid-rows-[auto_auto_auto_1fr_auto]"
                  >
                     <PatientHeader />
                     <div className="m-auto h-full w-full max-w-[1920px] self-start px-5 py-10 lg:px-12 lg:py-6">
                        {children}
                     </div>
                     <PatientFooter />
                  </div>
               </main>
            </Provider>
            <script>window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}</script><script id="zsiqscript" src="https://salesiq.zohopublic.com/widget?wc=siq988e04d3a2bed606447f16fad8f9a6150fc7cd9c3a35c6c44938134b2421fd15" defer></script>
         </body>
      </html>
   );
}
