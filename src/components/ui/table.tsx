"use client";

import React, { ReactNode, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Column definition for the table
 */
export interface TableColumn<T> {
  key: keyof T;
  label: string | ReactNode;
  width?: string | number; // e.g., "200px", 200
  render?: (value: T[keyof T], row: T, rowIndex: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  isFixed?: boolean; // Only first column should be fixed
  sortable?: boolean; // Enable sorting for this column
  sortFn?: (a: T, b: T) => number; // Custom sort function
}

/**
 * Sort configuration
 */
export interface SortConfig<T> {
  key: keyof T | null;
  direction: "asc" | "desc" | null;
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
  // Sorting
  sortable?: boolean;
  defaultSort?: SortConfig<T>;
  onSortChange?: (sort: SortConfig<T>) => void;
  // Pagination
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  // Column reordering
  onColumnOrderChange?: (newColumns: TableColumn<T>[]) => void;
}

/**
 * Sortable Header Cell Component
 */
interface SortableHeaderCellProps {
  id: string;
  column: TableColumn<Record<string, unknown>>;
  width: string;
  sortConfig: SortConfig<Record<string, unknown>> | null;
  onSort?: (key: keyof Record<string, unknown>) => void;
  onResize?: (newWidth: number) => void;
}

function SortableHeaderCell({
  id,
  column,
  width,
  sortConfig,
  onSort,
  onResize,
}: SortableHeaderCellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width,
    minWidth: width,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = parseInt(width);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startXRef.current;
        const newWidth = Math.max(100, startWidthRef.current + diff);
        onResize?.(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width, onResize]
  );

  const isSorted = sortConfig?.key === column.key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "px-4 py-4 flex items-center justify-between relative group",
        "text-xs !font-bold text-[#1D1F20]",
        column.headerClassName,
        isDragging && "z-50"
      )}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="text-[#9E9E9E]">
            <circle cx="3" cy="3" r="1.5" fill="currentColor" />
            <circle cx="9" cy="3" r="1.5" fill="currentColor" />
            <circle cx="3" cy="9" r="1.5" fill="currentColor" />
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          </svg>
        </button>
        <button
          onClick={() => column.sortable && onSort?.(column.key)}
          className={cn(
            "flex items-center gap-1 flex-1 min-w-0",
            column.sortable && "cursor-pointer hover:text-[#01959F]"
          )}
          disabled={!column.sortable}>
          <span className="truncate">{column.label}</span>
          {column.sortable && (
            <span className="flex flex-col">
              <svg
                width="8"
                height="4"
                viewBox="0 0 8 4"
                className={cn(
                  "mb-[-2px]",
                  sortDirection === "asc"
                    ? "text-[#01959F]"
                    : "text-[#BDBDBD]"
                )}>
                <path
                  d="M4 0L0 4H8L4 0Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                width="8"
                height="4"
                viewBox="0 0 8 4"
                className={cn(
                  sortDirection === "desc"
                    ? "text-[#01959F]"
                    : "text-[#BDBDBD]"
                )}>
                <path
                  d="M4 4L8 0H0L4 4Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className={cn(
          "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize",
          "hover:bg-[#01959F] transition-colors",
          isResizing && "bg-[#01959F]",
          "opacity-0 group-hover:opacity-100"
        )}
        aria-label="Resize column"
      />
    </div>
  );
}

/**
 * Reusable Table Component with Fixed First Column
 *
 * Features:
 * - Fixed first column (stays visible when scrolling horizontally)
 * - Resizable columns (drag to adjust width)
 * - Reorderable columns (drag and drop to change order)
 * - Sorting support
 * - Pagination support
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
 *   { key: 'name', label: 'Name', width: '200px', isFixed: true, sortable: true },
 *   { key: 'email', label: 'Email', width: '250px', sortable: true },
 *   { key: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> },
 * ];
 *
 * <Table
 *   columns={columns}
 *   data={users}
 *   rowKey="id"
 *   sortable
 *   pagination={{
 *     currentPage: 1,
 *     pageSize: 10,
 *     totalItems: 100,
 *     onPageChange: (page) => setCurrentPage(page),
 *   }}
 * />
 * ```
 */
const Table = React.forwardRef<
  HTMLDivElement,
  TableProps<Record<string, unknown>>
>(
  (
    {
      columns: initialColumns,
      data,
      rowKey,
      containerClassName,
      rowClassName,
      hoverable = true,
      onRowClick,
      emptyMessage = "No data available",
      loading = false,
      loadingRows = 5,
      sortable = false,
      defaultSort,
      onSortChange,
      pagination,
      onColumnOrderChange,
    },
    ref
  ) => {
    // Column state management
    const [columns, setColumns] = useState(initialColumns);
    const [columnWidths, setColumnWidths] = useState<Record<string, string>>(
      () => {
        const widths: Record<string, string> = {};
        initialColumns.forEach((col) => {
          const key = String(col.key);
          widths[key] =
            typeof col.width === "number"
              ? `${col.width}px`
              : col.width || "150px";
        });
        return widths;
      }
    );

    // Sorting state
    const [sortConfig, setSortConfig] = useState<SortConfig<
      Record<string, unknown>
    > | null>(defaultSort || null);

    // DnD sensors
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    // Update columns when initialColumns changes
    React.useEffect(() => {
      setColumns(initialColumns);
    }, [initialColumns]);

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
          setColumns((items) => {
            const oldIndex = items.findIndex(
              (item) => String(item.key) === active.id
            );
            const newIndex = items.findIndex(
              (item) => String(item.key) === over.id
            );

            const newOrder = arrayMove(items, oldIndex, newIndex);
            onColumnOrderChange?.(newOrder);
            return newOrder;
          });
        }
      },
      [onColumnOrderChange]
    );

    const handleSort = useCallback(
      (key: keyof Record<string, unknown>) => {
        setSortConfig((current) => {
          let newDirection: "asc" | "desc" | null = "asc";

          if (current?.key === key) {
            if (current.direction === "asc") {
              newDirection = "desc";
            } else if (current.direction === "desc") {
              newDirection = null;
            }
          }

          const newConfig: SortConfig<Record<string, unknown>> = {
            key: newDirection ? key : null,
            direction: newDirection,
          };

          onSortChange?.(newConfig);
          return newConfig;
        });
      },
      [onSortChange]
    );

    const handleResize = useCallback((key: string, newWidth: number) => {
      setColumnWidths((prev) => ({
        ...prev,
        [key]: `${newWidth}px`,
      }));
    }, []);

    // Sort data if sorting is enabled
    const sortedData = React.useMemo(() => {
      if (!sortable || !sortConfig?.key || !sortConfig.direction) {
        return data;
      }

      const column = columns.find((col) => col.key === sortConfig.key);
      const sortFn = column?.sortFn;

      return [...data].sort((a, b) => {
        if (sortFn) {
          return sortConfig.direction === "asc" ? sortFn(a, b) : sortFn(b, a);
        }

        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }, [data, sortable, sortConfig, columns]);

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

    const getColumnWidth = (key: keyof Record<string, unknown>): string => {
      return columnWidths[String(key)] || "150px";
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <div className="flex flex-row w-full relative gap-0">
              {/* Custom scrollbar styles */}
              <style>{`
            .table-scroll-container {
              scrollbar-width: thin;
              scrollbar-color: #01959F #F5F5F5;
            }
            .table-scroll-container::-webkit-scrollbar {
              height: 6px;
              width: 6px;
            }
            .table-scroll-container::-webkit-scrollbar-track {
              background: #F5F5F5;
              border-radius: 4px;
            }
            .table-scroll-container::-webkit-scrollbar-thumb {
              background: #01959F;
              border-radius: 4px;
            }
            .table-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #008c96;
            }
            .table-scroll-container::-webkit-scrollbar-button:start:decrement,
            .table-scroll-container::-webkit-scrollbar-button:end:increment {
              display: none;
              height: 0;
              background: transparent;
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
                    <SortableContext
                      items={actualFixedColumns.map((col) => String(col.key))}
                      strategy={horizontalListSortingStrategy}>
                      {actualFixedColumns.map((column) => (
                        <div
                          key={String(column.key)}
                          style={{
                            width: getColumnWidth(column.key),
                            minWidth: getColumnWidth(column.key),
                          }}
                          className={cn(
                            "px-4 py-4 flex items-center",
                            "text-xs !font-bold text-[#1D1F20]",
                            column.headerClassName
                          )}>
                          {column.label}
                        </div>
                      ))}
                    </SortableContext>
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
                              width: getColumnWidth(column.key),
                              minWidth: getColumnWidth(column.key),
                            }}
                            className="px-4 py-4 border-[#EDEDED]">
                            <div className="h-4 bg-[#E0E0E0] rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ))
                  ) : sortedData.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-[#404040]">
                      {emptyMessage}
                    </div>
                  ) : (
                    sortedData.map((row, rowIndex) => (
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
                              width: getColumnWidth(column.key),
                              minWidth: getColumnWidth(column.key),
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
                    "bg-[#FAFAFA] border-b border-[#EDEDED]",
                    "min-w-min"
                  )}>
                  <SortableContext
                    items={actualScrollableColumns.map((col) =>
                      String(col.key)
                    )}
                    strategy={horizontalListSortingStrategy}>
                    {actualScrollableColumns.map((column) => (
                      <SortableHeaderCell
                        key={String(column.key)}
                        id={String(column.key)}
                        column={column}
                        width={getColumnWidth(column.key)}
                        sortConfig={sortConfig}
                        onSort={sortable ? handleSort : undefined}
                        onResize={(newWidth) =>
                          handleResize(String(column.key), newWidth)
                        }
                      />
                    ))}
                  </SortableContext>
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
                                width: getColumnWidth(column.key),
                                minWidth: getColumnWidth(column.key),
                              }}
                              className={cn("px-4 py-4 flex-shrink-0")}>
                              <div className="h-4 bg-[#E0E0E0] rounded animate-pulse" />
                            </div>
                          ))}
                        </div>
                      ))
                    : sortedData.length === 0
                    ? null
                    : sortedData.map((row, rowIndex) => (
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
                                width: getColumnWidth(column.key),
                                minWidth: getColumnWidth(column.key),
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
          </DndContext>

          {/* Pagination */}
          {pagination && pagination.totalItems > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-[#E0E0E0] pt-4">
              <div className="text-sm text-[#404040]">
                Showing{" "}
                {Math.min(
                  (pagination.currentPage - 1) * pagination.pageSize + 1,
                  pagination.totalItems
                )}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage - 1)
                  }
                  disabled={pagination.currentPage === 1}
                  className={cn(
                    "px-3 py-1 text-sm rounded border",
                    pagination.currentPage === 1
                      ? "border-[#E0E0E0] text-[#BDBDBD] cursor-not-allowed"
                      : "border-[#01959F] text-[#01959F] hover:bg-[#01959F] hover:text-white"
                  )}>
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({
                    length: Math.ceil(
                      pagination.totalItems / pagination.pageSize
                    ),
                  }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const totalPages = Math.ceil(
                      pagination.totalItems / pagination.pageSize
                    );

                    // Show first page, last page, current page, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - pagination.currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => pagination.onPageChange(pageNum)}
                          className={cn(
                            "px-3 py-1 text-sm rounded border",
                            pageNum === pagination.currentPage
                              ? "bg-[#01959F] text-white border-[#01959F]"
                              : "border-[#E0E0E0] text-[#404040] hover:border-[#01959F]"
                          )}>
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === pagination.currentPage - 2 ||
                      pageNum === pagination.currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="px-2 py-1 text-sm text-[#BDBDBD]">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage + 1)
                  }
                  disabled={
                    pagination.currentPage >=
                    Math.ceil(pagination.totalItems / pagination.pageSize)
                  }
                  className={cn(
                    "px-3 py-1 text-sm rounded border",
                    pagination.currentPage >=
                      Math.ceil(pagination.totalItems / pagination.pageSize)
                      ? "border-[#E0E0E0] text-[#BDBDBD] cursor-not-allowed"
                      : "border-[#01959F] text-[#01959F] hover:bg-[#01959F] hover:text-white"
                  )}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Table.displayName = "Table";

export { Table };
