import {
  getOriginUrl,
  validateUser,
  redirectWithSuccess,
  OAuthError,
  DatabaseError,
  handleAllErrors,
} from "../utils";

export async function POST(request: Request) {
  const origin = await getOriginUrl();

  try {
    // Validate user and get Supabase client
    const { user, supabase } = await validateUser();

    // Extract and validate connection ID
    const formData = await request.formData();
    const connectionId = formData.get("connection_id")?.toString();

    if (!connectionId) {
      throw new OAuthError("missing_connection_id");
    }

    const { error: deleteError } = await supabase
      .from("user_supabase_connections")
      .delete()
      .eq("id", connectionId)
      .eq("user_id", user.id); // Extra safety check

    if (deleteError) {
      throw new DatabaseError("Failed to delete user connection");
    }

    return redirectWithSuccess(origin, "disconnected");
  } catch (error) {
    return handleAllErrors(origin, error);
  }
}
