import { Button, ButtonProps } from "@/components/ui/button";
import { FC } from "react";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });

export const StatButton: FC<
  ButtonProps & { count: number; total: number; statName: string }
> = ({ count, total, statName, ...props }) => {
  const stat = `${statName}:${count}/${total}`;
  const color = count === total ? "green" : "red";
  return (
    <Button {...props}>
      <span>{total}</span>
      <span style={{ color }}>{stat}</span>
    </Button>
  );
};
