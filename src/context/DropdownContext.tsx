"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface DropdownContextType {
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  toggleDropdown: (id: string) => void;
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = useCallback((id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  const value: DropdownContextType = {
    openDropdownId,
    setOpenDropdownId,
    toggleDropdown,
    closeDropdown,
  };

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error("useDropdown must be used within DropdownProvider");
  }
  return context;
}
