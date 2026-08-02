import { type PropsWithChildren, Suspense } from "react";
import InitialLoader from "../components/InitialLoader";

export default function LoadingBoundary({
  children,
}: Readonly<PropsWithChildren>) {
  return <Suspense fallback={<InitialLoader />}>{children}</Suspense>;
}
