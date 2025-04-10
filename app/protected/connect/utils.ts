import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export type OAuthErrorState =
  | "invalid_state"
  | "no_code"
  | "token_exchange_failed"
  | "missing_client_id"
  | "missing_connection_id"
  | "disconnect_failed"
  | "user_not_authenticated";

export type OAuthSuccess = "connected" | "disconnected";

interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export async function getOriginUrl(): Promise<string> {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function validateUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new OAuthError("user_not_authenticated");
  }

  return { user, supabase };
}

export function getOAuthConfig(origin: string): AuthConfig {
  const clientId = process.env.SUPABASE_AUTH_CLIENT_ID;
  const clientSecret = process.env.SUPABASE_AUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new OAuthError("missing_client_id");
  }

  return {
    clientId,
    clientSecret,
    redirectUri: `${origin}/protected/connect/callback`,
  };
}

export async function exchangeCodeForTokens(code: string, config: AuthConfig) {
  const response = await fetch("https://api.supabase.com/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Token exchange failed:", { status: response.status, error });
    throw new OAuthError("token_exchange_failed");
  }

  return response.json();
}

export function redirectWithError(origin: string, error: string) {
  return NextResponse.redirect(`${origin}/protected/connect?error=${error}`);
}

export function redirectWithSuccess(origin: string, success: OAuthSuccess) {
  return NextResponse.redirect(
    `${origin}/protected/connect?success=${success}`,
  );
}

export class OAuthError extends Error {
  constructor(public type: OAuthErrorState) {
    super(type);
    this.name = "OAuthError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export function handleAllErrors(origin: string, error: unknown) {
  console.error("Error:", error);
  if (error instanceof OAuthError) {
    return redirectWithError(origin, error as unknown as OAuthErrorState);
  }
  if (error instanceof DatabaseError) {
    return redirectWithError(origin, "database_error");
  }
  return redirectWithError(origin, "unknown_error");
}
