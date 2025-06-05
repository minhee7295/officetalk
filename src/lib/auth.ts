import { supabase } from "./supabase"

export const getUserSession = async () => {
    const {data, error} = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return data.session;
}