import { createClient } from "@/services/supabase/server";

export default async function Schools() {
  const supabase = await createClient();
  const { data: schools } = await supabase.from("Schools").select();

  return <pre>{JSON.stringify(schools, null, 2)}</pre>;
}
