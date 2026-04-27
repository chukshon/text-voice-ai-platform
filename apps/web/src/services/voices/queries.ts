import { useQuery } from "@tanstack/react-query";
import { getLibraryRequest } from "@/services/voices/requests";
import { GetLibraryResponseT } from "@/services/voices/types";
import { GetLibraryQueryT } from "@/schema/voices.schema";

export const useGetLibrary = (getLibraryQuery: GetLibraryQueryT) => {
  return useQuery<GetLibraryResponseT>({
    queryKey: ["library", getLibraryQuery],
    queryFn: () => getLibraryRequest(getLibraryQuery),
  });
};
