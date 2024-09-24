'use client';

import Image from 'next/image';
import logo from '@/public/logodcc.svg';
interface IPatientFooter {}

export default function PatientFooter({}: IPatientFooter) {
   return (
      <footer className="flex w-full flex-col items-center gap-5 bg-foundation p-5 pb-10 sm:flex-row sm:justify-between lg:px-12 lg:pb-14 lg:pt-6">
         <p className="text-xs">© 2024 APP DCC</p>
         <div className="relative aspect-[56/24] w-32">
            <Image alt="agenda ahora logo" src={logo} fill />
         </div>
      </footer>
   );
}
