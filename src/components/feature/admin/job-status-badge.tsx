import type { Job } from "@/types/database";

interface JobStatusBadgeProps {
  status: Job["status"];
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const statusConfig = {
    active: {
      bg: "bg-[#F8FBF9]",
      border: "border-[#B8DBCA]",
      text: "text-[#43936C]",
      label: "Active",
    },
    inactive: {
      bg: "bg-[#FFFAFA]",
      border: "border-[#F5B1B7]",
      text: "text-[#E11428]",
      label: "Inactive",
    },
    draft: {
      bg: "bg-[#FFFCF5]",
      border: "border-[#FEEABC]",
      text: "text-[#FBC037]",
      label: "Draft",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-4 py-1
        rounded-lg border
        ${config.bg} ${config.border}
      `}>
      <span className={`text-sm font-bold ${config.text}`}>{config.label}</span>
    </div>
  );
}
