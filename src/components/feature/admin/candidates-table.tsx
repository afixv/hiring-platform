"use client";

import { useState, useMemo, useCallback } from "react";
import type { Applicant } from "@/types/database";
import { Table, type TableColumn } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface CandidatesTableProps {
  data: Applicant[];
}

export default function CandidatesTable({ data }: CandidatesTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (applicant) =>
        applicant.full_name?.toLowerCase().includes(query) ||
        applicant.email?.toLowerCase().includes(query) ||
        applicant.phone_number?.toLowerCase().includes(query) ||
        applicant.domicile?.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage]);

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

  // Check all / Uncheck all handler for current page only
  const handleSelectAll = useCallback(
    (checked: boolean | "indeterminate") => {
      setSelectedRows((prev) => {
        const newSelection = new Set(prev);
        
        if (checked === true) {
          // Add all current page items to selection
          paginatedData.forEach((item) => newSelection.add(item.id));
        } else {
          // Remove all current page items from selection
          paginatedData.forEach((item) => newSelection.delete(item.id));
        }
        
        return newSelection;
      });
    },
    [paginatedData]
  );

  // Calculate header checkbox state based on current page only
  const headerCheckboxState = useMemo(() => {
    if (paginatedData.length === 0) return false;
    
    const selectedOnCurrentPage = paginatedData.filter((item) =>
      selectedRows.has(item.id)
    ).length;

    if (selectedOnCurrentPage === 0) return false;
    if (selectedOnCurrentPage === paginatedData.length) return true;
    return "indeterminate" as const;
  }, [selectedRows, paginatedData]);

  // Custom header for NAMA LENGKAP with Select All checkbox
  const nameColumnHeader = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <Checkbox
          checked={headerCheckboxState}
          onCheckedChange={handleSelectAll}
        />
        <span>NAMA LENGKAP</span>
      </div>
    ),
    [headerCheckboxState, handleSelectAll]
  );

  // Define columns with sorting support
  const columns = useMemo<TableColumn<Record<string, unknown>>[]>(
    () => [
      {
        key: "id",
        label: nameColumnHeader,
        width: "250px",
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
    {
      key: "domicile",
      label: "DOMICILE",
      width: "150px",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-neutral-100">
          {typeof value === "string" ? value : "-"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "APPLIED DATE",
      width: "180px",
      sortable: true,
      render: (value) => {
        if (!value || typeof value !== "string") return <span className="text-sm text-neutral-70">-</span>;
        const date = new Date(value);
        return (
          <span className="text-sm text-neutral-100">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
      sortFn: (a, b) => {
        const aDate = new Date((a as unknown as Applicant).created_at || 0);
        const bDate = new Date((b as unknown as Applicant).created_at || 0);
        return aDate.getTime() - bDate.getTime();
      },
    },
  ],
  [selectedRows, handleSelectRow, nameColumnHeader]
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search candidates by name, email, phone, or domicile..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full"
          />
        </div>
        {selectedRows.size > 0 && (
          <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              {selectedRows.size} candidate{selectedRows.size !== 1 ? "s" : ""}{" "}
              selected
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData as unknown as Record<string, unknown>[]}
        rowKey="id"
        emptyMessage="No candidates found"
        containerClassName="rounded-xl"
        sortable
        pagination={{
          currentPage,
          pageSize,
          totalItems: filteredData.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}

