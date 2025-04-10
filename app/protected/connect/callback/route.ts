import { createApi } from "../../utils";
import {
  getOriginUrl,
  validateUser,
  getOAuthConfig,
  exchangeCodeForTokens,
  redirectWithSuccess,
} from "../utils";
import { OAuthError, handleAllErrors } from "../utils";
import { DatabaseError } from "../utils";

export async function GET(request: Request) {
  const origin = await getOriginUrl();

  try {
    // Validate user and get Supabase client
    const { user, supabase } = await validateUser();

    // Extract and validate OAuth parameters
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");

    // Verify state parameter to prevent CSRF attacks
    const storedState = (user?.user_metadata as { oauth_state?: string })
      ?.oauth_state;

    // Clear the state immediately for security
    await supabase.auth.updateUser({ data: { oauth_state: null } });

    if (!state || state !== storedState) {
      throw new OAuthError("invalid_state");
    }

    if (!code) {
      throw new OAuthError("no_code");
    }

    // Get OAuth configuration and exchange code for tokens
    const config = getOAuthConfig(origin);
    const tokens = await exchangeCodeForTokens(code, config);
    const api = createApi("https://api.supabase.com", tokens.access_token);
    const organizations =
      await api.get<[{ name: string }]>("/v1/organizations");

    // Store the connection in the database
    const { error: insertError } = await supabase
      .from("user_supabase_connections")
      .insert({
        user_id: user.id,
        organization: organizations[0].name,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(
          Date.now() + tokens.expires_in * 1000,
        ).toISOString(),
      });

    if (insertError) {
      throw new DatabaseError("Failed to insert user connection");
    }

    return redirectWithSuccess(origin, "connected");
  } catch (error) {
    return handleAllErrors(origin, error);
  }
}
