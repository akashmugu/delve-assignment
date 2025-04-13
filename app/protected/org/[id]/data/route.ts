import { createClient } from "@/utils/supabase/server";
import {
  createClient as createClientClient,
  User,
} from "@supabase/supabase-js";
import { createApi } from "../../../utils";
import { sql_functions } from "./sql_functions";

export type Project = {
  id: string;
  name: string;
  pitr_enabled: boolean;
  created_at: string;

  secret_key: string;
  users: {
    id: string;
    email?: string;
    mfa_enabled: boolean;
    created_at: string;
  }[];
  tables: {
    name: string;
    rls_enabled: boolean;
  }[];
};

const errorSafe = async <T>(promise: any): Promise<T> => {
  const { data, error } = await promise;
  if (error) throw error;
  if (data == null) throw new Error("No data returned");
  return data;
};
const getAllProjects = async (access_token: string) => {
  const api = createApi("https://api.supabase.com", access_token);

  return await Promise.all(
    // # for every project:
    (await api.get<Project[]>("/v1/projects")).map(async (project) => {
      // ## check PITR status
      const backups = await api.get<{ pitr_enabled: boolean }>(
        `/v1/projects/${project.id}/database/backups`,
      );
      project.pitr_enabled = backups.pitr_enabled;

      // ## create client for RLS and MFA checks
      const keys = await api.get<{ name: string; api_key: string }[]>(
        `/v1/projects/${project.id}/api-keys`,
      );
      project.secret_key = keys.find(
        (key) => key.name === "service_role",
      )!.api_key;

      const client = createClientClient(
        // TODO: get from API, instead of hardcoding
        `https://${project.id}.supabase.co`,
        project.secret_key,
      );

      // ## check RLS status (for all tables)
      // ### run sql query: add functions to get tables and RLS status
      await api.post(`/v1/projects/${project.id}/database/query`, {
        query: sql_functions,
      });

      // ### get all tables
      project.tables = await Promise.all(
        (
          await errorSafe<{ table_name: string }[]>(
            client.rpc("get_all_tables"),
          )
        ).map(async ({ table_name }) => {
          const rls_enabled = await errorSafe<boolean>(
            client.rpc("get_rls_status", { table_name }),
          );
          return {
            name: table_name,
            rls_enabled,
          };
        }),
      );

      // ## check MFA status (for all users)
      project.users = await Promise.all(
        (
          await errorSafe<{ users: User[] }>(client.auth.admin.listUsers())
        ).users.map(async (user) => {
          const {
            user: { id, email, factors },
          } = await errorSafe<{ user: User }>(
            client.auth.admin.getUserById(user.id),
          );
          return {
            id,
            email,
            mfa_enabled: factors
              ? factors.filter((f) => f.status === "verified").length > 0
              : false,
            created_at: user.created_at,
          };
        }),
      );

      // ## return project with all checks
      return project;
    }),
  );
};

export type OrgData = {
  id: string;
  orgPath: string;
  name: string;
  projects: Project[];
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: connection, error } = await supabase
    .from("user_supabase_connections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!connection) throw new Error("No connection data returned");

  return Response.json({
    id: connection.id,
    orgPath: `/protected/org/${connection.id}`,
    name: connection.organization,
    projects: await getAllProjects(connection.access_token),
  } satisfies OrgData);
}
