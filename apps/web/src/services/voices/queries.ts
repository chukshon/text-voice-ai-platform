import { useQuery } from "@tanstack/react-query";
import {
  getLibraryRequest,
  getVoiceByIdRequest,
  getVoicesRequest,
} from "@/services/voices/requests";
import {
  GetLibraryResponseT,
  GetVoiceByIdResponseT,
  GetVoicesResponseT,
} from "@/services/voices/types";
import { GetLibraryQueryT } from "@/schema/voices.schema";

export const useGetLibrary = (getLibraryQuery: GetLibraryQueryT) => {
  return useQuery<GetLibraryResponseT>({
    queryKey: ["get-library", getLibraryQuery],
    queryFn: () => getLibraryRequest(getLibraryQuery),
  });
};

export const useGetVoices = () => {
  return useQuery<GetVoicesResponseT>({
    queryKey: ["get-voices"],
    queryFn: () => getVoicesRequest(),
  });
};

export const useGetVoiceById = (voiceId: string) => {
  return useQuery<GetVoiceByIdResponseT>({
    queryKey: ["get-voice-by-id", voiceId],
    queryFn: () => getVoiceByIdRequest(voiceId),
  });
};
