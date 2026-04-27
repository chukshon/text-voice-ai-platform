import { useQuery } from "@tanstack/react-query";
import { getLoggedInUserRequest } from "@/services/auth/requests";
import { GetLoggedInUserResponseT } from "./types";

export const useGetLoggedInUserQuery = (isAuthenticated: boolean) => {
  return useQuery<GetLoggedInUserResponseT>({
    queryKey: ["loggedInUser"],
    queryFn: () => getLoggedInUserRequest(),
    enabled: isAuthenticated,
  });
};
