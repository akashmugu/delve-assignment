"use client";

import { capitalize } from "@/app/utils";
import { useUrlFilter } from "@/app/hooks";
import MultiSelectFilter from "@/app/MultiSelectFilter";
import { StatButton } from "../utils";
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

const rls_values = ["enabled", "disabled"];

export default function TablesPage() {
  const { name: orgName, projects } = useOrgContext();
  const { selected: selectedProjects } = useUrlFilter({
    paramKey: "project",
    allValues: projects.map((p) => p.id),
  });
  const { selected: selectedRls } = useUrlFilter({
    paramKey: "rls",
    allValues: rls_values,
  });
  const all_tables = projects
    .map((p) => p.tables.map((t) => ({ ...t, project: p })))
    .flat();
  const visible_tables = all_tables.filter(
    (t) =>
      selectedProjects.includes(t.project.id) &&
      selectedRls.includes(t.rls_enabled ? "enabled" : "disabled"),
  );

  return (
    <Box title={`${orgName} / Tables`}>
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
          <span>RLS:</span>
          <MultiSelectFilter
            paramKey="rls"
            allValues={rls_values}
            labelForValue={(value) => capitalize(value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>RLS Enabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible_tables.map((table) => {
            return (
              <TableRow key={table.name}>
                <TableCell>{table.name}</TableCell>
                <TableCell>{table.project.name}</TableCell>
                <TableCell>{table.rls_enabled ? "✅" : "❌"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>
              <StatButton
                count={visible_tables.filter((p) => p.rls_enabled).length}
                total={visible_tables.length}
                statName="RLS"
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
