"use client";

import { useRouter } from "next/navigation";
import { formatDate, StatButton } from "../utils";
import { useOrgContext } from "../context";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box } from "@/components/layout/box";
import { DummyTableFooter } from "@/components/dummy-table-footer";

export default function ProjectsPage() {
  const router = useRouter();
  const { name: orgName, projects, orgPath } = useOrgContext();
  const all_users = projects.map((p) => p.users).flat();
  const all_tables = projects.map((p) => p.tables).flat();

  return (
    <Box title={`${orgName} / Projects`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>PITR Enabled</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Tables</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            return (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{formatDate(project.created_at)}</TableCell>
                <TableCell>{project.pitr_enabled ? "✅" : "❌"}</TableCell>
                <TableCell>
                  <StatButton
                    count={project.users.filter((p) => p.mfa_enabled).length}
                    total={project.users.length}
                    statName="MFA"
                    variant="outline"
                    className="flex space-x-2"
                    onClick={() =>
                      router.push(`${orgPath}/users?project=${project.id}`)
                    }
                  />
                </TableCell>
                <TableCell>
                  <StatButton
                    count={project.tables.filter((p) => p.rls_enabled).length}
                    total={project.tables.length}
                    statName="RLS"
                    variant="outline"
                    className="flex space-x-2"
                    onClick={() =>
                      router.push(`${orgPath}/tables?project=${project.id}`)
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>All Projects</TableCell>
            <TableCell>
              <StatButton
                count={all_users.filter((p) => p.mfa_enabled).length}
                total={all_users.length}
                statName="MFA"
                variant="outline"
                className="flex space-x-2"
                onClick={() => router.push(`${orgPath}/users`)}
              />
            </TableCell>
            <TableCell>
              <StatButton
                count={all_tables.filter((p) => p.rls_enabled).length}
                total={all_tables.length}
                statName="RLS"
                variant="outline"
                className="flex space-x-2"
                onClick={() => router.push(`${orgPath}/tables`)}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <DummyTableFooter />
    </Box>
  );
}
