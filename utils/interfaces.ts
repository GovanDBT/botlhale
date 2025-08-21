// utils/interfaces.ts
// file for storing our reusable type interfaces

export interface School {
  id: number;
  name: string;
  email?: string;
  admins?: string[];
  teachers?: string[];
  students?: string[];
  created_by?: string;
  created_at?: string;
  profile?: {
    firstname: string;
    lastname: string;
  } | null;
}