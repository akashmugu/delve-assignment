import { createClient } from "@/utils/supabase/server";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OAuthErrorState, OAuthSuccess } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box } from "@/components/layout/box";
import { title } from "@/app/constants";
import { StatusAlert } from "@/components/status-alert";
import Link from "next/link";

interface Connection {
  id: string;
  organization: string;
  created_at: string;
}

interface SearchParams {
  error?: OAuthErrorState;
  success?: OAuthSuccess;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const errorMessages: Record<OAuthErrorState, string> = {
  invalid_state: "Invalid state parameter. Please try again.",
  no_code: "No authorization code received. Please try again.",
  token_exchange_failed:
    "Failed to exchange code for tokens. Please try again.",
  missing_client_id: "OAuth configuration error. Please contact support.",
  missing_connection_id: "Connection ID is missing. Please try again.",
  disconnect_failed: "Failed to disconnect organization. Please try again.",
  user_not_authenticated:
    "User is not authenticated. Please sign in and try again.",
};

const successMessages: Record<OAuthSuccess, string> = {
  connected: "Successfully connected your Supabase organization!",
  disconnected: "Successfully disconnected your Supabase organization!",
};

export default async function ConnectSupabasePage({
  searchParams: searchParamsPromise,
}: PageProps) {
  const supabase = await createClient();
  const searchParams = await searchParamsPromise;

  try {
    // Clean up expired connections first
    const { error: cleanupError } = await supabase
      .from("user_supabase_connections")
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (cleanupError) {
      throw new Error(`Failed to clean up expired connections`);
    }

    // Get existing connections (all remaining ones are unexpired)
    const { data: connections, error } = await supabase
      .from("user_supabase_connections")
      .select("*");

    if (error) throw error;
    if (!connections) throw new Error("No connections data returned");

    return (
      <Box title={title}>
        <StatusAlert>
          Connect your Supabase organization for compliance checks
        </StatusAlert>

        {searchParams.error && (
          <StatusAlert icon={XCircle} variant="destructive">
            {errorMessages[searchParams.error]}
          </StatusAlert>
        )}

        {searchParams.success && (
          <StatusAlert
            icon={CheckCircle2}
            className="border-success/50 text-success"
          >
            {successMessages[searchParams.success]}
          </StatusAlert>
        )}

        <>
          {connections.length > 0 ? (
            <>
              <p className="text-muted-foreground text-center">
                Your connected Supabase organizations:
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Connected On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connections.map((connection: Connection) => (
                    <TableRow key={connection.id}>
                      <TableCell>{connection.organization}</TableCell>
                      <TableCell>
                        {new Date(connection.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="flex space-x-4">
                        <Link href={`/protected/org/${connection.id}`}>
                          <Button variant="default" size="sm">
                            Check Compliance
                          </Button>
                        </Link>

                        <form
                          action="/protected/connect/disconnect"
                          method="POST"
                        >
                          <input
                            type="hidden"
                            name="connection_id"
                            value={connection.id}
                          />
                          <Button type="submit" variant="destructive" size="sm">
                            Disconnect
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-muted-foreground text-center">
              To check your Supabase organization for compliance, we need access
              to your organization's resources. Click the button below to
              securely connect your Supabase organization.
            </p>
          )}

          <form
            action="/protected/connect/oauth"
            className="flex justify-center p-4"
          >
            <Button type="submit" size="lg">
              {connections.length > 0
                ? "Connect Another Organization"
                : "Connect Supabase Organization"}
            </Button>
          </form>
        </>
      </Box>
    );
  } catch (error) {
    console.error("Error fetching connections:", error);
    return (
      <div className="flex-1 w-full flex flex-col gap-6">
        <StatusAlert icon={XCircle} variant="destructive">
          Error loading connections. Please try again.
        </StatusAlert>
        <Button onClick={() => window.location.reload()} size="sm">
          Retry
        </Button>
      </div>
    );
  }
}
