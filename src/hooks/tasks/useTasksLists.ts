import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { fetchUserTaskLists } from "@/api/tasks";

// --- QUERIES ----
export const useTaskLists = () => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ["taskLists", user?.uid],
    queryFn: () => fetchUserTaskLists(user!.uid),
    enabled: !!user,
  });
};
