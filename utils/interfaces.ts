// utils/interfaces.ts
// file for storing our reusable type interfaces

// Define the type for schools
export interface School {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  school_type?: string;
  location?: string;
  description?: string;
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

// Define the type for the school admin
export interface SchoolAdmin {
  id: number;
  profile_id?: string;
  profile_status?: string;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  school?: {
    name: string;
  };
  created_at?: string;
}

export interface Profile {
  id: string;
  profile_id: string;
  profile_role: string;
  profile_status: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  school?: {
    id: number;
    name: string;
  };
  created_at: string;
}