import Link from "next/link";
import { Box } from "@/components/layout/box";
import { StatusAlert } from "@/components/status-alert";
import { Button } from "@/components/ui/button";
import { title } from "./constants";

export default async function Home() {
  return (
    <Box title={title}>
      <StatusAlert>
        Verify your Supabase configuration for security and compliance.
        <br />
        Scan for MFA, RLS, PITR and more — all in one place.
      </StatusAlert>

      <Link href="/sign-in">
        <Button size="lg" className="w-full">
          Get Started
        </Button>
      </Link>
    </Box>
  );
}
