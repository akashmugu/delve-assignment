"use client";

import { useParams } from "next/navigation";
import OrgContextProvider from "./context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { id: orgId } = useParams<{ id: string }>();

  return <OrgContextProvider orgId={orgId}>{children}</OrgContextProvider>;
}
