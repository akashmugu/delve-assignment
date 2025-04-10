import { Button } from "./ui/button";

export const DummyTableFooter = () => {
  return (
    <div className="flex justify-between w-full">
      <Button variant="secondary" disabled>
        Notes
      </Button>
      <Button variant="secondary" disabled>
        Auto Fix
      </Button>
    </div>
  );
};
