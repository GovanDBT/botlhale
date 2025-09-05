// app/dashboard/superAdmin/schools/SchoolTableColumn.tsx
// School data table columns
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Archive,
  ArrowUpDown,
  Clipboard,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { School } from "@/utils/interfaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteSchool } from "@/hooks/useSchools";
import { toast } from "sonner";

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
  // school ID
  {
    accessorKey: "id",
    header: () => <div>School ID</div>,
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  // school name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Names
        <ArrowUpDown className="!size-[14]" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-wrap">{getValue<string>()}</div>
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
      const deleteSchoolMutation = useDeleteSchool(async (request) => {
        await toast.promise(request, {
          loading: "Deleting school...",
          success: () => {
            return "School has been successfully deleted";
          },
          error: (err: any) => {
            return (
              err.message ||
              "Failed to delete school. An unexpected error has occurred"
            );
          },
        });
      });
      const school = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(school.toString())}
                className="cursor-pointer"
              >
                <Clipboard className="!size-[14]" /> Copy Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(school.toString())}
                className="cursor-pointer"
              >
                <Clipboard className="!size-[14]" /> Copy Phone
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Archive className="!size-[14]" /> Archive School
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* Delete School */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="!text-red-500 hover:!text-red-500 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 color="#fb2c36" className="!size-[14]" />
                    Delete School
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="z-50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 justify-center md:justify-start">
                      {" "}
                      <Trash2
                        size={17}
                        className="mb-0.5 hidden md:inline-flex"
                      />{" "}
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="font-bold">
                        This action cannot be undone.
                      </span>{" "}
                      This will permanently delete the selected school
                      <span className="font-bold text-red-400">
                        ({row.getValue("name")})
                      </span>{" "}
                      and remove the school from our servers and database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 cursor-pointer hover:bg-red-700"
                      onClick={() => {
                        const selectedId = [row.original.id.toString()];
                        deleteSchoolMutation.mutate(selectedId);
                      }}
                    >
                      Delete School
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
