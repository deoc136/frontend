import './globals.css';
import type { Metadata } from 'next';
import { Lato, Poppins } from 'next/font/google';
import { Providers } from '@/app/provider';
import { Side, applyAxiosConfig } from '@/config/axios-config';
import PatientHeader from './patient/components/PatientHeader';
import PatientFooter from './patient/components/PatientFooter';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/src/aws-exports';
import Head from 'next/head'; // Import Head component

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

Amplify.configure(awsconfig);
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
         <Head>
            {/* Google Analytics */}
            <script
               async
               src="https://www.googletagmanager.com/gtag/js?id=G-85QRTMK0C4"
            ></script>
            <script
               dangerouslySetInnerHTML={{
                  __html: `
                     window.dataLayer = window.dataLayer || [];
                     function gtag(){dataLayer.push(arguments);}
                     gtag('js', new Date());
                     gtag('config', 'G-85QRTMK0C4');
                  `,
               }}
            />
         </Head>
         <body className="relative min-h-screen">
            <Providers>
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
            </Providers>
         </body>
      </html>
   );
}
