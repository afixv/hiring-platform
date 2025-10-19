"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserAvatarDropdown() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!user) return null;

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:opacity-80 transition-opacity cursor-pointer">
        <Avatar className="size-8">
          <AvatarImage src={user.profile_picture} alt={user.full_name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-modal border border-neutral-40 z-50">
          <div className="p-4 border-b border-neutral-40">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={user.profile_picture} alt={user.full_name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm-bold text-neutral-100 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-neutral-70 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-1 bg-primary-surface text-primary text-xs font-medium rounded">
                  {role === "admin" ? "Admin" : "Jobseeker"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3">
            <Button
              onClick={handleLogout}
              leadingIcon={<LogOut className="size-4" />}
              className="w-full flex items-center justify-center gap-2 bg-danger hover:bg-danger-hover text-white text-sm font-medium py-2 rounded-lg transition">
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
