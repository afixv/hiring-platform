"use client";

import { useState, useMemo, useCallback } from "react";
import type { Applicant } from "@/types/database";
import { Table, type TableColumn } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface CandidatesTableProps {
  data: Applicant[];
}

export default function CandidatesTable({ data }: CandidatesTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((applicant) =>
      applicant.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(id);
      } else {
        newSelection.delete(id);
      }
      return newSelection;
    });
  }, []);

  // Check all / Uncheck all handler
  const handleSelectAll = useCallback(
    (checked: boolean | "indeterminate") => {
      if (checked === "indeterminate") {
        // If indeterminate, select all
        setSelectedRows(new Set(filteredData.map((item) => item.id)));
      } else if (checked === true) {
        // If not all selected, select all
        setSelectedRows(new Set(filteredData.map((item) => item.id)));
      } else {
        // If all selected, clear all
        setSelectedRows(new Set());
      }
    },
    [filteredData]
  );

  // Calculate header checkbox state
  const headerCheckboxState = useMemo(() => {
    const selectedCount = selectedRows.size;
    const totalCount = filteredData.length;

    if (selectedCount === 0) return false;
    if (selectedCount === totalCount) return true;
    return "indeterminate" as const;
  }, [selectedRows, filteredData]);

  const columns = useMemo<TableColumn<Record<string, unknown>>[]>(
    () => [
      {
        key: "id",
        label: (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={headerCheckboxState}
              onCheckedChange={handleSelectAll}
            />
            <span>NAMA LENGKAP</span>
          </div>
        ),
        width: "200px",
        isFixed: true,
        render: (_, row) => {
          const applicant = row as unknown as Applicant;
          return (
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedRows.has(applicant.id)}
                onCheckedChange={(checked) =>
                  handleSelectRow(applicant.id, checked as boolean)
                }
              />
              <span className="text-sm text-neutral-100">
                {applicant.full_name || "-"}
              </span>
            </div>
          );
        },
      },
      {
        key: "email",
        label: "EMAIL ADDRESS",
        width: "250px",
        render: (value) => (
          <span className="text-sm text-neutral-100">
            {typeof value === "string" ? value : "-"}
          </span>
        ),
      },
      {
        key: "phone_number",
        label: "PHONE NUMBERS",
        width: "180px",
        render: (value) => (
          <span className="text-sm text-neutral-100">
            {typeof value === "string" ? value : "-"}
          </span>
        ),
      },
      {
        key: "date_of_birth",
        label: "DATE OF BIRTH",
        width: "180px",
        render: (value) => (
          <span className="text-sm text-neutral-100">
            {typeof value === "string" ? value : "-"}
          </span>
        ),
      },
      {
        key: "domicile",
        label: "DOMICILE",
        width: "150px",
        render: (value) => (
          <span className="text-sm text-neutral-100">
            {typeof value === "string" ? value : "-"}
          </span>
        ),
      },
      {
        key: "gender",
        label: "GENDER",
        width: "120px",
        render: (value) => (
          <span className="text-sm text-neutral-100">
            {typeof value === "string" ? value : "-"}
          </span>
        ),
      },
      {
        key: "linkedin_link",
        label: "LINK LINKEDIN",
        width: "200px",
        render: (value) => {
          const link = value as string | null;
          if (!link) return <span className="text-sm text-neutral-70">-</span>;
          return (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block max-w-xs truncate text-sm text-primary hover:underline">
              {link}
            </a>
          );
        },
      },
    ],
    [selectedRows, handleSelectRow, handleSelectAll, headerCheckboxState]
  );

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={filteredData as unknown as Record<string, unknown>[]}
        rowKey="id"
        emptyMessage="No candidates found"
        containerClassName="rounded-xl"
      />

      {selectedRows.size > 0 && (
        <div className="p-4 bg-neutral-20 rounded-lg border border-neutral-40">
          <p className="text-sm text-neutral-100">
            {selectedRows.size} candidate{selectedRows.size !== 1 ? "s" : ""}{" "}
            selected
          </p>
        </div>
      )}
    </div>
  );
}
