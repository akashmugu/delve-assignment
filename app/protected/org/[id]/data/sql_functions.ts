export const sql_functions = `
-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE (table_name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT t.tablename::text AS table_name
    FROM pg_tables t
    WHERE t.schemaname = 'public'
    ORDER BY t.tablename;
END;
$$;

-- Function to check if RLS is enabled for a table in the public schema
CREATE OR REPLACE FUNCTION get_rls_status(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = table_name
        AND schemaname = 'public'
        AND rowsecurity = true
    );
END;
$$; 
`;
