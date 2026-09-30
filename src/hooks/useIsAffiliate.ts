import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useIsAffiliate = () => {
  const { user } = useAuth();
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user) {
        setIsAffiliate(false);
        setChecking(false);
        return;
      }

      setChecking(true);

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "affiliate")
        .maybeSingle();

      if (cancelled) return;

      setIsAffiliate(!!data);
      setChecking(false);
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAffiliate, checking };
};
