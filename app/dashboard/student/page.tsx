import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import SignOutButton from "../../components/SignOutButton";

export default async function StudentDashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  const session = await supabase.auth.getUser();
  console.log(session);
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <p>Hello {data.user.email}, I am a student</p>
      <SignOutButton />
    </>
  );
}
