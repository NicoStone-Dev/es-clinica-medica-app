"use client";

import { Button } from "@mui/material";
import { useState } from "react";

export type ToggleSwitchProps = {
  primaryState: string;
  secondaryState: string;
  className?: string;
};

export function ToggleSwitch({
  primaryState,
  secondaryState,
  className = "",
}: ToggleSwitchProps) {
  const [state, setState] = useState(primaryState);

  return (
    <div
      className={`flex w-full items-center gap-0 rounded-[12px] overflow-hidden bg-surface ${className}`}
    >
      <Button
        sx={{ textTransform: "none" }}
        onClick={() => setState(`${primaryState}`)}
        className={
          state === `${primaryState}`
            ? "!bg-blue-gray-400 !text-surface w-full"
            : "w-full !text-blue-gray-600"
        }
      >
        Profissional
      </Button>
      <Button
        sx={{ textTransform: "none" }}
        onClick={() => setState(`${secondaryState}`)}
        className={
          state === `${secondaryState}`
            ? "!bg-blue-gray-400 !text-surface w-full"
            : "w-full !text-blue-gray-600"
        }
      >
        Administrador
      </Button>
    </div>
  );
}
