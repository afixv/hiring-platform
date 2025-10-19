"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Column definition for the table
 */
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  width?: string | number; // e.g., "200px", 200
  render?: (value: T[keyof T], row: T, rowIndex: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  isFixed?: boolean; // Only first column should be fixed
}

/**
 * Table component props
 */
interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T; // Unique identifier for each row
  containerClassName?: string;
  rowClassName?: string;
  hoverable?: boolean;
  onRowClick?: (row: T, rowIndex: number) => void;
  emptyMessage?: string;
  loading?: boolean;
  loadingRows?: number;
}

/**
 * Reusable Table Component with Fixed First Column
 *
 * Features:
 * - Fixed first column (stays visible when scrolling horizontally)
 * - Fully customizable columns
 * - Responsive design
 * - Custom row rendering
 * - Striped rows, hover effects, borders
 * - Empty state handling
 * - Loading skeleton support
 *
 * @example
 * ```tsx
 * const columns: TableColumn<User>[] = [
 *   { key: 'name', label: 'Name', width: '200px', isFixed: true },
 *   { key: 'email', label: 'Email', width: '250px' },
 *   { key: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> },
 * ];
 *
 * <Table columns={columns} data={users} rowKey="id" />
 * ```
 */
const Table = React.forwardRef<
  HTMLDivElement,
  TableProps<Record<string, unknown>>
>(
  (
    {
      columns,
      data,
      rowKey,
      containerClassName,
      rowClassName,
      hoverable = true,
      onRowClick,
      emptyMessage = "No data available",
      loading = false,
      loadingRows = 5,
    },
    ref
  ) => {
    // Separate fixed and scrollable columns
    const fixedColumns = columns.filter((col) => col.isFixed);

    // Ensure only first column can be fixed
    const firstColumn = columns[0];
    const actualFixedColumns =
      fixedColumns.length > 0 ? fixedColumns : firstColumn ? [firstColumn] : [];
    const actualScrollableColumns = columns.slice(
      actualFixedColumns.length > 0 &&
        columns.indexOf(actualFixedColumns[0]) === 0
        ? 1
        : 0
    );

    const getColumnWidth = (width?: string | number): string => {
      if (!width) return "auto";
      return typeof width === "number" ? `${width}px` : width;
    };

    const renderCell = (
      column: TableColumn<Record<string, unknown>>,
      row: Record<string, unknown>,
      rowIndex: number
    ): ReactNode => {
      const value = row[column.key];
      return column.render
        ? column.render(value, row, rowIndex)
        : (value as ReactNode);
    };

    return (
      <div
        className={cn(
          "w-full border border-[#E0E0E0] rounded-lg overflow-hidden shadow-sm p-6",
          containerClassName
        )}>
        <div ref={ref} className="w-full">
          {/* Table wrapper with horizontal scroll */}
          <div className="flex flex-row w-full relative gap-0">
            {/* Custom scrollbar styles */}
            <style>{`
            .table-scroll-container::-webkit-scrollbar {
              height: 10px;
            }
            .table-scroll-container::-webkit-scrollbar-track {
              background: #EDEDED;
            }
            .table-scroll-container::-webkit-scrollbar-thumb {
              background: #01959F;
              border-radius: 8px;
              height: 123px;
            }
            .table-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #008c96;
            }
          `}</style>
            {/* Fixed Column Section */}
            {actualFixedColumns.length > 0 && (
              <div className="flex-shrink-0 border-r border-[#E0E0E0] shadow-modal relative z-10">
                {/* Header */}
                <div
                  className={cn(
                    "flex flex-row items-center gap-0",
                    "bg-[#FAFAFA] border-b border-[#EDEDED]"
                  )}>
                  {actualFixedColumns.map((column) => (
                    <div
                      key={String(column.key)}
                      style={{
                        width: getColumnWidth(column.width),
                        minWidth: getColumnWidth(column.width || "150px"),
                      }}
                      className={cn(
                        "px-4 py-4 flex items-center",
                        "text-xs !font-bold text-[#1D1F20]",
                        column.headerClassName
                      )}>
                      {column.label}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {loading ? (
                  Array.from({ length: loadingRows }).map((_, rowIndex) => (
                    <div
                      key={`skeleton-${rowIndex}`}
                      className="flex flex-row items-center gap-0 border-b border-[#EDEDED] last:border-b-0">
                      {actualFixedColumns.map((column) => (
                        <div
                          key={String(column.key)}
                          style={{
                            width: getColumnWidth(column.width),
                            minWidth: getColumnWidth(column.width || "150px"),
                          }}
                          className="px-4 py-4 border-[#EDEDED]">
                          <div className="h-4 bg-[#E0E0E0] rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ))
                ) : data.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[#404040]">
                    {emptyMessage}
                  </div>
                ) : (
                  data.map((row, rowIndex) => (
                    <div
                      key={String(row[rowKey])}
                      onClick={() => onRowClick?.(row, rowIndex)}
                      className={cn(
                        "flex flex-row items-center gap-0",
                        " border-[#EDEDED] last:border-b-0",
                        "bg-white",
                        hoverable && "hover:bg-[#F5F5F5] transition-colors",
                        onRowClick && "cursor-pointer",
                        rowClassName
                      )}>
                      {actualFixedColumns.map((column) => (
                        <div
                          key={String(column.key)}
                          style={{
                            width: getColumnWidth(column.width),
                            minWidth: getColumnWidth(column.width || "150px"),
                          }}
                          className={cn(
                            "px-4 py-4 text-sm text-[#404040]",
                            "border-b border-[#EDEDED]",
                            column.cellClassName
                          )}>
                          {renderCell(column, row, rowIndex)}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Scrollable Columns Section */}
            <div className="flex-1 overflow-x-auto table-scroll-container">
              {/* Header */}
              <div
                className={cn(
                  "flex flex-row items-center gap-0",
                  "bg-[#FCFCFC] border-[#EDEDED]",
                  "min-w-min"
                )}>
                {actualScrollableColumns.map((column) => (
                  <div
                    key={String(column.key)}
                    style={{
                      width: getColumnWidth(column.width),
                      minWidth: getColumnWidth(column.width || "150px"),
                    }}
                    className={cn(
                      "px-4 py-4 flex items-center flex-shrink-0",
                      "text-xs !font-bold text-[#1D1F20]",
                      "border-b border-[#EDEDED]",
                      column.headerClassName
                    )}>
                    {column.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div>
                {loading
                  ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                      <div
                        key={`skeleton-${rowIndex}`}
                        className={cn(
                          "flex flex-row items-center gap-0",
                          "min-w-min"
                        )}>
                        {actualScrollableColumns.map((column) => (
                          <div
                            key={String(column.key)}
                            style={{
                              width: getColumnWidth(column.width),
                              minWidth: getColumnWidth(column.width || "150px"),
                            }}
                            className={cn(
                              "px-4 py-4 flex-shrink-0",
                            )}>
                            <div className="h-4 bg-[#E0E0E0] rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ))
                  : data.length === 0
                  ? null
                  : data.map((row, rowIndex) => (
                      <div
                        key={`${String(row[rowKey])}-scrollable`}
                        onClick={() => onRowClick?.(row, rowIndex)}
                        className={cn(
                          "flex flex-row items-center gap-0",
                          "border-b border-[#EDEDED] last:border-b-0",
                          "bg-white",
                          hoverable && "hover:bg-[#F5F5F5] transition-colors",
                          onRowClick && "cursor-pointer",
                          "min-w-min",
                          rowClassName
                        )}>
                        {actualScrollableColumns.map((column) => (
                          <div
                            key={String(column.key)}
                            style={{
                              width: getColumnWidth(column.width),
                              minWidth: getColumnWidth(column.width || "150px"),
                            }}
                            className={cn(
                              "px-4 py-4 text-sm text-[#404040] flex-shrink-0",
                              column.cellClassName
                            )}>
                            {renderCell(column, row, rowIndex)}
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Table.displayName = "Table";

export { Table };
