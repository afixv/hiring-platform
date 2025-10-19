"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { Job } from "@/types/database";
import { Button } from "@/components/ui/button";
import { JobStatusBadge } from "./job-status-badge";
import { useDropdown } from "@/context/DropdownContext";

interface JobCardProps {
  job: Job;
  onStatusChange: (jobId: string, status: Job["status"]) => void;
}

export function JobCard({ job, onStatusChange }: JobCardProps) {
  const router = useRouter();
  const { openDropdownId, setOpenDropdownId, closeDropdown } = useDropdown();
  const isStatusOpen = openDropdownId === job.id;
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statuses: Job["status"][] = ["draft", "active", "inactive"];

  const statusColors = {
    active: "text-[#43936C]",
    inactive: "text-[#E11428]",
    draft: "text-[#FBC037]",
  };

  const statusBg = {
    active: "hover:bg-[#43936C]/10",
    inactive: "hover:bg-[#E11428]/10",
    draft: "hover:bg-[#FBC037]/10",
  };

  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  useEffect(() => {
    if (!isStatusOpen || !dropdownRef.current) return;

    const checkPosition = () => {
      const button = dropdownRef.current?.querySelector("button");
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const dropdownHeight = 140; 
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    };

    const timer = setTimeout(checkPosition, 0);
    return () => clearTimeout(timer);
  }, [isStatusOpen]);

  return (
    <div className="rounded-2xl border border-neutral-40 bg-neutral-10 p-6 shadow-modal">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <JobStatusBadge status={job.status} />
          <span className="text-sm text-neutral-80 py-1 px-4 border-neutral-40 border rounded-sm">
            started on {formatDate(job.started_on)}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="heading-sm-bold mb-2 text-neutral-100">{job.title}</h3>
          <p className="text-base text-neutral-80">
            {job.salary_range?.display_text}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdownId(isStatusOpen ? null : job.id)}
              className="flex w-full md:w-fit justify-center items-center gap-2 rounded-lg border border-neutral-40 bg-neutral-10 px-3 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-20 h-8">
              <span className={statusColors[job.status]}>●</span>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              <ChevronDown
                className={`size-4 transition-transform ${
                  isStatusOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isStatusOpen && (
              <div
                className={`absolute right-0 z-50 min-w-40 rounded-lg border border-neutral-40 bg-neutral-10 py-2 shadow-md ${
                  dropdownPosition === "bottom"
                    ? "top-full mt-1"
                    : "bottom-full mb-1"
                }`}>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(job.id, status);
                      closeDropdown();
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      job.status === status
                        ? "bg-primary/10 font-medium text-primary"
                        : `text-neutral-70 ${statusBg[status]}`
                    }`}>
                    <span className={`mr-2 ${statusColors[status]}`}>●</span>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => router.push(`/admin/jobs/${job.id}/candidates`)}>
            Manage Job
          </Button>
        </div>
      </div>
    </div>
  );
}
