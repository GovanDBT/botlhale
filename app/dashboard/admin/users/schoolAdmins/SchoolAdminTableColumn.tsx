// app/dashboard/superAdmin/users/school_admins/SchoolAdminTableColumn.tsx
// School admins data table columns
"use client";
import DeleteAlertDialog from "@/app/dashboard/components/DeleteAlertDialog";
import SchoolAdminDetails from "@/app/dashboard/components/SchoolAdminDetails";
import UpdateSchoolAdmin from "@/app/dashboard/components/UpdateSchoolAdmin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SchoolAdmin } from "@/utils/interfaces";
import { UseMutationResult } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArrowUpDown,
  BookUser,
  Clipboard,
  MoreHorizontal,
  SquarePen,
} from "lucide-react";

// Define the columns for the table
export const getColumns = (
  deleteSchoolAdminMutation: UseMutationResult<void, Error, string[], unknown>
): ColumnDef<SchoolAdmin>[] => [
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
  // fullname
  {
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    accessorKey: "fullname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Fullname
        <ArrowUpDown className="!size-[14]" />
      </Button>
    ),
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  // email
  {
    accessorKey: "email",
    header: () => <div className="hidden sm:table cell">Email</div>,
    cell: ({ row }) => (
      <div className="hidden sm:table cell">{row.getValue("email")}</div>
    ),
  },
  // phone
  {
    accessorKey: "phone",
    header: () => <div className="hidden md:table cell">Phone</div>,
    cell: ({ row }) => (
      <div className="hidden md:table cell">{row.getValue("phone")}</div>
    ),
  },
  // school
  {
    accessorFn: (row) => `${row.school?.name} ${row.school?.school_level}`,
    accessorKey: "school",
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
        className="hidden lg:flex cell cursor-pointer"
      >
        Created At
        <ArrowUpDown className="!size-[14]" />
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
      const selectedId = [row.original.id.toString()];
      const id = row.original;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
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
              {/* View User */}
              <SchoolAdminDetails id={row.original.id.toString()}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <BookUser className="!size-[14]" /> User details
                </DropdownMenuItem>
              </SchoolAdminDetails>
              <UpdateSchoolAdmin id={row.original.id.toString()}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <SquarePen className="!size-[14]" /> Update User
                </DropdownMenuItem>
              </UpdateSchoolAdmin>
              <DropdownMenuItem>
                {" "}
                <Archive className="!size-[14]" /> Archive User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* Delete User */}
                <DeleteAlertDialog
                  title="user"
                  data={() => row.getValue("fullname")}
                  deleteFn={() => deleteSchoolAdminMutation.mutate(selectedId)}
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
