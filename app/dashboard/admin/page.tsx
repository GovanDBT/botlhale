import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import SignOutButton from "../../components/SignOutButton";
import { Separator } from "@/components/ui/separator";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <h1 className="text-2xl/8 sm:text-xl/8 font-bold">Dashboard</h1>
      <Separator className="my-4" />
      <p>Hello {data.user.email}</p>
      <SignOutButton />
    </>
  );
}
