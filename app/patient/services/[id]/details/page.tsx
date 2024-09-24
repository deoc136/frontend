import { redirect } from 'next/navigation';
import DetailsView from './views/DetailsView';
import { clinicRoutes } from '@/lib/routes';
import { getServiceById } from '@/services/service';
import { getAllPackagesByServiceId } from '@/services/package';

export const revalidate = 0;

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  try {
    // Fetch both service and packages simultaneously
    const [{ data: service }, { data: packages }] = await Promise.all([
      getServiceById(id),
      getAllPackagesByServiceId(id),
    ]);

    // Check if service is not active or removed, and redirect if necessary
    if (!service || service.removed || !service.active) {
      // You can use redirect to send the user to a 404 page or a specific clinic route
    }

    // Render the details view with the fetched service and packages
    return <DetailsView service={service} packages={packages} />;

  } catch (error) {
    // Handle errors gracefully
    console.error('Error fetching service or packages:', error);

    // Redirect to a 404 page or another error page
  }
}
