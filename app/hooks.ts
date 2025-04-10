import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlFilter({
  paramKey,
  allValues,
}: {
  paramKey: string;
  allValues: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSelected = useCallback(
    (selected: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      const allSelected =
        selected.length === allValues.length &&
        allValues.every((val) => selected.includes(val));

      if (selected.length === 0) {
        params.set(paramKey, "none");
      } else if (allSelected) {
        params.delete(paramKey);
      } else {
        params.set(paramKey, selected.join(","));
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [router, pathname, searchParams, allValues, paramKey],
  );

  const getSelected = useCallback((): string[] => {
    const raw = searchParams.get(paramKey);
    if (!raw) return allValues;
    if (raw === "none") return [];
    return raw.split(",").filter((val) => val);
  }, [searchParams, allValues, paramKey]);

  return {
    selected: getSelected(),
    setSelected,
  };
}
