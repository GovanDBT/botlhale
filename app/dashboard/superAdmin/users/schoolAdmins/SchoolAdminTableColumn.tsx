// app/dashboard/superAdmin/users/school_admins/SchoolAdminTableColumn.tsx
// School admins data table columns
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Archive,
  ArrowUpDown,
  BookUser,
  Clipboard,
  MoreHorizontal,
  SquarePen,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SchoolAdmin } from "@/utils/interfaces";

// Define the columns for the table
export const columns: ColumnDef<SchoolAdmin>[] = [
  // admin supabase id as a checkbox
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
  // User id
  {
    accessorFn: (row) => (
      <div>
        {row.profile_id}
        <br />
        <span className="text-[10px] bg-[#db8e01]/15 px-2 py-0.3 rounded-xl inline-block text-[#db8e01] font-bold mt-1">
          {row.profile_status}
        </span>
      </div>
    ),
    id: "profile_id",
    header: () => <div>User ID</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  // school admin fullname
  {
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    id: "fullname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold"
      >
        Fullname
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  // school admin email
  {
    accessorKey: "email",
    header: () => <div className="hidden sm:table cell">Email</div>,
    cell: ({ row }) => (
      <div className="hidden sm:table cell">{row.getValue("email")}</div>
    ),
  },
  // school admin phone
  {
    accessorKey: "phone",
    header: () => <div className="hidden md:table cell">Phone</div>,
    cell: ({ row }) => (
      <div className="hidden md:table cell">{row.getValue("phone")}</div>
    ),
  },
  // school admins school
  {
    accessorFn: (row) => row.school?.name ?? "",
    id: "school",
    header: () => <div className="hidden lg:table cell">School</div>,
    cell: ({ getValue }) => (
      <div className="hidden lg:table cell text-wrap">{getValue<string>()}</div>
    ),
  },
  // date created
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
  // action dropdown
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original;

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
              onClick={() => navigator.clipboard.writeText(id.toString())}
            >
              {" "}
              <Clipboard className="!size-[14]" /> Copy Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              {" "}
              <Clipboard className="!size-[14]" /> Copy Phone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <BookUser className="!size-[14]" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              {" "}
              <SquarePen className="!size-[14]" /> Edit User
            </DropdownMenuItem>
            <DropdownMenuItem>
              {" "}
              <Archive className="!size-[14]" /> Archive User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 hover:!text-red-500">
              <Trash color="#fb2c36" className="!size-[14]" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
