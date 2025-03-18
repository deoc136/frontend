'use client';

import { store } from '@/lib/store';
import { Provider as ReduxProvider } from 'react-redux';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { Side, applyAxiosConfig } from '@/config/axios-config';

export default function Provider({ children }: { children: React.ReactNode }) {
  // Apply axios config on client-side
  useEffect(() => {
    console.log('[PROVIDER] Initializing provider and applying axios config');
    applyAxiosConfig(Side.client);
    console.log('[PROVIDER] Axios configured for client-side');
  }, []);
  
  return (
    <ReduxProvider store={store}>
      <Authenticator.Provider>
        {children}
      </Authenticator.Provider>
    </ReduxProvider>
  );
}
