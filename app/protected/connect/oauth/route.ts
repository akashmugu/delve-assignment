import crypto from "crypto";
import {
  getOriginUrl,
  validateUser,
  getOAuthConfig,
  handleAllErrors,
} from "../utils";

// This is the route that initiates the OAuth flow
// https://supabase.com/docs/guides/integrations/build-a-supabase-integration#redirecting-to-the-authorize-url
export async function GET(request: Request) {
  const origin = await getOriginUrl();

  try {
    // Validate user and get Supabase client
    const { supabase } = await validateUser();

    // Get OAuth configuration and generate state
    const config = getOAuthConfig(origin);
    const state = crypto.randomUUID();

    // Store state parameter for CSRF protection
    await supabase.auth.updateUser({
      data: { oauth_state: state },
    });

    // Construct OAuth URL with proper parameters
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      state,
    });

    return Response.redirect(
      `https://api.supabase.com/v1/oauth/authorize?${params.toString()}`
    );
  } catch (error) {
    return handleAllErrors(origin, error);
  }
}
