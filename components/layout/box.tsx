import { FC, ReactNode } from "react";

export const Box: FC<{ title: ReactNode; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <h1 className="text-2xl">{title}</h1>
      {children}
    </>
  );
};
