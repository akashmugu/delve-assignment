"use client";

import { capitalize } from "@/app/utils";
import { useUrlFilter } from "@/app/hooks";
import MultiSelectFilter from "@/app/MultiSelectFilter";
import { useOrgContext } from "../context";
import { formatDate, StatButton } from "../utils";
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

const mfa_values = ["enabled", "disabled"];

export default function UsersPage() {
  const { name: orgName, projects } = useOrgContext();
  const { selected: selectedProjects } = useUrlFilter({
    paramKey: "project",
    allValues: projects.map((p) => p.id),
  });
  const { selected: selectedMfa } = useUrlFilter({
    paramKey: "mfa",
    allValues: mfa_values,
  });
  const all_users = projects
    .map((p) => p.users.map((u) => ({ ...u, project: p })))
    .flat();
  const visible_users = all_users.filter((u) => {
    return (
      selectedProjects.includes(u.project.id) &&
      selectedMfa.includes(u.mfa_enabled ? "enabled" : "disabled")
    );
  });

  return (
    <Box title={`${orgName} / Users`}>
      <div className="flex justify-between space-x-64">
        <div className="flex items-center space-x-2">
          <span>Projects:</span>
          <MultiSelectFilter
            paramKey="project"
            allValues={projects.map((p) => p.id)}
            labelForValue={(id) => projects.find((p) => p.id === id)!.name}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span>MFA:</span>
          <MultiSelectFilter
            paramKey="mfa"
            allValues={mfa_values}
            labelForValue={(value) => capitalize(value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>MFA Enabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible_users.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell title={user.id}>{user.id.slice(0, 8)}...</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.project.name}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{user.mfa_enabled ? "✅" : "❌"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell>
              <StatButton
                count={visible_users.filter((p) => p.mfa_enabled).length}
                total={visible_users.length}
                statName="MFA"
                variant="outline"
                className="flex space-x-2"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <DummyTableFooter />
    </Box>
  );
}
