/**
 * This component is used to create a table to show a list of all schools
 * TODO: Make the table reusable
 */
"use client";
import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  CircleX,
  MoreHorizontal,
} from "lucide-react";
import LoadingTable from "./LoadingTable";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/services/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Rollbar from "rollbar";
import { clientConfig } from "@/services/rollbar/rollbar";

// Define the type for the school table
interface School {
  id: number;
  name: string;
  email: string;
  admins: string[];
  teachers: string[];
  students: string[];
  created_by: string;
  created_at: string;
  profile: {
    firstname: string;
    lastname: string;
  } | null;
}

// Define the columns for the table
export const columns: ColumnDef<School>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold"
      >
        Names
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="hidden sm:table cell">Emails</div>,
    cell: ({ row }) => (
      <div className="hidden sm:table cell">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "admins",
    header: () => <div className="hidden md:table cell">Admins</div>,
    cell: ({ row }) => <div className="hidden md:table cell">#</div>,
  },
  {
    accessorKey: "teachers",
    header: () => <div className="hidden lg:table cell">Teachers</div>,
    cell: ({ row }) => <div className="hidden lg:table cell">#</div>,
  },
  {
    accessorKey: "students",
    header: () => <div className="hidden lg:table cell">Students</div>,
    cell: ({ row }) => <div className="hidden lg:table cell">#</div>,
  },
  {
    accessorKey: "profile",
    header: () => <div className="hidden lg:table cell">Created By</div>,
    cell: ({ row }) => {
      const profile = row.getValue("profile") as {
        firstname: string;
        lastname: string;
      };
      if (!profile) return <div className="hidden lg:table cell">—</div>;

      return (
        <div className="hidden lg:table cell">
          {profile.firstname} {profile.lastname}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold hidden lg:flex cell"
      >
        Created At
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="hidden lg:table cell">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const school = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(school.id.toString())
              }
            >
              Copy school ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const SchoolTable = () => {
  // create new rollbar instance
  const rollbar = new Rollbar(clientConfig);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true }, // Default sorting by latest date created
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const supabase = createClient(); // Initialize Supabase client

  // Fetch schools from Supabase
  const fetchSchools = async (): Promise<School[]> => {
    const { data, error } = await supabase
      .from("school")
      .select("*, profile:created_by(firstname, lastname)");
    if (error) {
      rollbar.error("System failed to fetch school", error);
      throw new Error(error.message);
    }
    return data || [];
  };

  // Use React Query to manage fetched schools
  const {
    data: schools = [],
    error,
    isLoading,
  } = useQuery<School[], Error>({
    queryKey: ["schools"],
    queryFn: fetchSchools,
  });

  // Initialize React Table
  const table = useReactTable({
    data: schools, // Pass fetched schools data
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Render loading state
  if (isLoading) return <LoadingTable />;

  // Render error state
  if (error)
    return (
      <p className="font-bold flex gap-2 justify-center h-[200] place-items-center">
        {" "}
        <CircleX fill="#000" color="#fff" /> An unexpected error occurred while
        fetching schools
      </p>
    );

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  No results.
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
};

export default SchoolTable;
