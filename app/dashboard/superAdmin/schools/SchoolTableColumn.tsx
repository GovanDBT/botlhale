/**
 * School table columns used to define the core of the table
 * data shown: school_id, school name, school email, school phone,
 * # of teachers, # of students, # of admins, date created, created by.
 */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { School } from "@/utils/interfaces";

// Define the columns for the table
export const columns: ColumnDef<School>[] = [
  // school ID as a checkbox
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
  // school name
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
    cell: ({ getValue }) => (
      <div className="text-wrap">{getValue<string>()}</div>
    ),
  },
  // school email
  {
    accessorKey: "email",
    header: () => <div className="hidden sm:table cell">Emails</div>,
    cell: ({ row }) => (
      <div className="hidden sm:table cell">{row.getValue("email")}</div>
    ),
  },
  // number of admins
  {
    accessorKey: "admins",
    header: () => <div className="hidden md:table cell">Admins</div>,
    cell: ({ row }) => <div className="hidden md:table cell">#</div>,
  },
  // number of teachers
  {
    accessorKey: "teachers",
    header: () => <div className="hidden lg:table cell">Teachers</div>,
    cell: ({ row }) => <div className="hidden lg:table cell">#</div>,
  },
  // number of students
  {
    accessorKey: "students",
    header: () => <div className="hidden lg:table cell">Students</div>,
    cell: ({ row }) => <div className="hidden lg:table cell">#</div>,
  },
  // created by
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
