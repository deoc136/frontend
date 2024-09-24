import { getServiceById } from '@/services/service';
import { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export async function generateMetadata({
   params,
}: {
   params: { id: string;};
}): Promise<Metadata> {
   try {
      const service = (await getServiceById( params.id)).data;

      return {
         title: service.name
      };
   } catch (error) {
      return {
         title: 'Detalles de servicio'
      };
   }
}

export default function Layout({ children }: PropsWithChildren<unknown>) {
   return <div className="xl:px-24">{children}</div>;
}
