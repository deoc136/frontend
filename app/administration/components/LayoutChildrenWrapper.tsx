'use client';

import { clinicRoutes } from '@/lib/routes';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ILayoutChildrenWrapper {
   children: ReactNode;
}

export default function LayoutChildrenWrapper({
   children,
}: ILayoutChildrenWrapper) {
   const [showCorner, setShowCorner] = useState(true);

   const pathname = usePathname();

   useEffect(() => {
      setShowCorner(
         !pathname.includes(clinicRoutes().admin_setting) &&
            !(
               pathname.includes(clinicRoutes().admin_appointments) &&
               !pathname.includes('details') &&
               !pathname.includes('clinic-history')
            ),
      );
   }, [pathname]);

   return (
      <div
         className={`h-full max-w-[1920px] overflow-hidden ${
            showCorner ? 'bg-primary' : 'bg-white'
         }`}
      >
         <div className="relative h-full w-full overflow-auto rounded-tl-3xl bg-white px-14 pb-6 pt-10">
            {children}
         </div>
      </div>
   );
}
