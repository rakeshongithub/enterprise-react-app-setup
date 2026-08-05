import { useBreadcrumbs } from '../../router';

export default function DashboardPage() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <div>
      <h1>Dashboard</h1>

      <pre>{JSON.stringify(breadcrumbs, null, 2)}</pre>
    </div>
  );
}
