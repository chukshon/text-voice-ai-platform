import { useQuery } from "@tanstack/react-query";
import { getLibraryRequest, getVoicesRequest } from "@/services/voices/requests";
import { GetLibraryResponseT, GetVoicesResponseT } from "@/services/voices/types";
import { GetLibraryQueryT } from "@/schema/voices.schema";

export const useGetLibrary = (getLibraryQuery: GetLibraryQueryT) => {
  return useQuery<GetLibraryResponseT>({
    queryKey: ["library", getLibraryQuery],
    queryFn: () => getLibraryRequest(getLibraryQuery),
  });
};

export const useGetVoices = () => {
  return useQuery<GetVoicesResponseT>({
    queryKey: ["get-voices"],
    queryFn: () => getVoicesRequest(),
  });
};
