'use client';

import { store } from '@/lib/store';
import { Provider as ReduxProvider } from 'react-redux';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <Authenticator.Provider>
        {children}
      </Authenticator.Provider>
    </ReduxProvider>
  );
}
