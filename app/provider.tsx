'use client';

import { store } from '../lib/store';
import { Provider } from 'react-redux';
import { Side, applyAxiosConfig } from '@/config/axios-config';
import { useRef } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
   const isLoaded = useRef(false);

   !isLoaded.current &&
      (() => {
         applyAxiosConfig(Side.client);

         isLoaded.current = true;
      })();

   return <Provider store={store}>{children}</Provider>;
}
