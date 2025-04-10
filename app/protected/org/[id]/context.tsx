import { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import { StatusAlert } from "@/components/status-alert";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgData } from "./data/route";

const OrgContext = createContext<OrgData | undefined>(undefined);

const getOrgData = async (orgId: string): Promise<OrgData> => {
  const response = await fetch(`/protected/org/${orgId}/data`);
  return await response.json();
};

export default function OrgContextProvider({
  orgId,
  children,
}: {
  orgId: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<
    // init
    | { loading: true; error: undefined; data: undefined }

    // error
    | { loading: false; error: Error; data: undefined }

    // success
    | { loading: false; error: undefined; data: OrgData }
  >({ loading: true, error: undefined, data: undefined });

  useEffect(() => {
    getOrgData(orgId)
      .then((data) => {
        setState({ loading: false, error: undefined, data });
      })
      .catch((error) => {
        setState({ loading: false, error, data: undefined });
      });
  }, [orgId]);

  if (state.loading) {
    return <Spinner />;
  }

  if (state.error) {
    return (
      <div className="flex-1 w-full flex flex-col gap-6">
        <StatusAlert icon={XCircle} variant="destructive">
          Error loading organization data: {JSON.stringify(state.error)}
        </StatusAlert>
        <Button onClick={() => window.location.reload()} size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <OrgContext.Provider value={state.data}>{children}</OrgContext.Provider>
  );
}

export const useOrgContext = () => {
  const ctx = useContext(OrgContext);
  if (ctx === undefined) {
    throw new Error("useOrgContext can only be used inside OrgContextProvider");
  }
  return ctx;
};
