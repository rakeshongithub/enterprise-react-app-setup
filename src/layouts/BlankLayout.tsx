import { type PropsWithChildren } from "react";

export default function BlankLayout({
  children,
}: Readonly<PropsWithChildren<unknown>>) {
  return <>{children}</>;
}
