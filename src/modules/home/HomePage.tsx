import { useBreadcrumbs } from "../../router";

export default function HomePage() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div>
      <h1>Home</h1>

      <pre>{JSON.stringify(breadcrumbs, null, 2)}</pre>
    </div>
  );
}
