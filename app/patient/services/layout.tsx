import type { PropsWithChildren } from 'react';
import PatientHeader from '../components/PatientHeader';
import PatientFooter from '../components/PatientFooter';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { clinicRoutes } from '@/lib/routes';


interface ILayout extends PropsWithChildren<unknown> {
   params: {
      slug: string;
   };
}

export const revalidate = 0;

export default async function Layout({ children, params }: ILayout) {


   
      return (
         <main className="relative">
            <div
               id="patient-body"
               className="grid min-h-screen grid-rows-[auto_auto_auto_1fr_auto]"
            >
               <div className="m-auto h-full w-full max-w-[1920px] self-start px-5 py-10 lg:px-12 lg:py-6">
                  {children}
               </div>
            </div>
         </main>
      );
   } 

