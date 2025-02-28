import { supabase } from "../lib/supabase";

export const fetchGroups = async (search: string) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .ilike("name", `%${search}%`);

  if (error) {
    throw error;
  } else {
    return data;
  }
};
