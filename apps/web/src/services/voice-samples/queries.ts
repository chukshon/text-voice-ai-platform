import { useQuery } from "@tanstack/react-query";
import { GetVoiceSamplesResponseT } from "./types";
import { getVoiceSamplesRequest } from "./requests";

export const useGetVoiceSamples = (voiceId: string) => {
  return useQuery<GetVoiceSamplesResponseT>({
    queryKey: ["get-voice-samples", voiceId],
    queryFn: () => getVoiceSamplesRequest(voiceId),
  });
};
