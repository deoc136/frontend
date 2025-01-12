
import { getUserFullFilledById } from '@/services/user';
import { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const revalidate = 0;

export async function generateMetadata({
   params,
}: {
   params: { id: string; slug: string };
}): Promise<Metadata> {
   try {
      const { user } = (await getUserFullFilledById(params.slug, params.id))
         .data;

      return {
         title: `${user.names} ${user.last_names}`
      };
   } catch (error) {
      return {
         title: 'Detalles de usuario'
      };
   }
}

export default function Layout({ children }: PropsWithChildren<unknown>) {
   return <>{children}</>;
}
