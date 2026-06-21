"use client";

import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-[radial-gradient(70%_30%_at_10%_100%,_var(--color-blue-gray-200,#DCE9FF)_0%,_#FFF_125%)] gap-8 rounded-xl items-center p-10 min-w-100 max-w-fit w-full mx-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full pb-sm mb-md">
          <p className="text-blue-gray-600 text-heading font-bold ">
            {title}
          </p>
          <button
            className="px-sm py-sm rounded-sm bg-transparent text-blue-gray-500 outline-1 outline-surface hover:bg-surface hover:cursor-pointer transition-colors"
            onClick={onClose}
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
