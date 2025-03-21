'use client';

import { PropsWithChildren, useEffect } from 'react';
import AuthProvider from '@/components/providers/AuthProvider';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { changeTitle } from '@/lib/features/title/title_slice';

function AppointmentsLayoutContent({ children }: PropsWithChildren) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
       changeTitle({
          goBackRoute: null,
          value: 'Mis citas Agendadas',
       }),
    );
 }, [dispatch]);

  if (authStatus !== 'authenticated') {
    console.log('[APPOINTMENTS-LAYOUT] Authentication required');
    return null;
  }

  return <>{children}</>;
}

export default function AppointmentsLayout({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <AppointmentsLayoutContent>{children}</AppointmentsLayoutContent>
    </AuthProvider>
  );
}
