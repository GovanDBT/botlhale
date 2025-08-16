// app/dashboard/components/DataTable.tsx
// table data
"use client";

import * as React from "react";
import {
  ChevronDown,
  CircleX,
  Columns3,
  ListFilter,
  RefreshCcw,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingTable from "../superAdmin/components/LoadingTable";
import {} from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  error?: string | null;
  search: string[];
  refresh?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  refresh,
  isLoading = false,
  error = null,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState([{ id: "created_at", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMine, setFilterMine] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // query client for updating data
  const queryClient = useQueryClient();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      // If search is one column, default to built-in filtering
      if (search.length === 1) {
        const value = row.getValue(search[0]);
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      }
      // Multi-column search
      return search.some((col) => {
        const value = row.getValue(col);
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      });
    },
  });

  // Loading state
  if (isLoading) {
    return <LoadingTable />;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: [`${refresh}`] });
    setIsRefreshing(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4 gap-2">
        <Input
          placeholder={`Search by ${search.join(", ")}...`}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {/* refresh button */}
          <Button
            variant="outline"
            className="ml-auto text-[12px] cursor-pointer hidden md:inline-flex"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={
                isRefreshing === true ? "!size-[14] animate-spin" : "!size-[14]"
              }
            />{" "}
            Refresh
          </Button>
          {/* filter button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto text-[12px] cursor-pointer"
              >
                <ListFilter /> Filter <ChevronDown className="!size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Created By</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filterMine}
                onValueChange={setFilterMine}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mine">Me</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="invited">
                  Invited
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="authenticated">
                  Authenticated
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="suspended">
                  Suspended
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* columns button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto text-[12px] cursor-pointer hidden lg:inline-flex"
              >
                <Columns3 className="!size-[14]" />
                Columns <ChevronDown className="!size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {error ? `${error}` : "No Results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
