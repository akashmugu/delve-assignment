"use client";

import { redirect } from "next/navigation";
import { useOrgContext } from "./context";

export default function OrgIndex() {
  const { orgPath } = useOrgContext();
  redirect(`${orgPath}/projects`);
}
