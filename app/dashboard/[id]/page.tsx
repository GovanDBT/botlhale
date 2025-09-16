import SignOutButton from "@/app/components/SignOutButton";
import { createClient } from "@/services/supabase/server";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const SchoolPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: school, error: schoolError } = await supabase
    .from("school")
    .select("*")
    .eq("id", id)
    .single();

  if (!school || schoolError) {
    notFound();
  }

  return (
    <div>
      <div>{school.name}</div>
      <SignOutButton />
    </div>
  );
};

export default SchoolPage;
