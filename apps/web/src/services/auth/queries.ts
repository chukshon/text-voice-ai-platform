import { useQuery } from "@tanstack/react-query";
import { getLoggedInUserRequest } from "@/services/auth/requests";

export const useGetLoggedInUserQuery = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getLoggedInUserRequest(),
    enabled: isAuthenticated,
  });
};
