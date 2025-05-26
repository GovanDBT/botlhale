"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/client";

const SignOutButton = () => {
  const supabase = createClient();
  // Function to handle signout
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      redirect("/login"); // Redirect to login page after successful signout
    }
  }
  return <Button onClick={signOut}>Signout</Button>;
};

export default SignOutButton;
