import { useQuery } from "@tanstack/react-query";
import { GetTTSJobByIdResponseT, GetTTSJobsResponseT } from "./types";
import { getTTSJobByIdRequest, getTTSJobsRequest } from "./requests";

export const useGetTTSJobs = () => {
  return useQuery<GetTTSJobsResponseT>({
    queryKey: ["get-tts-jobs"],
    queryFn: () => getTTSJobsRequest(),
  });
};
type UseGetTTSJobByIdOptions = {
  refetchInterval?: number | false;
};

export const useGetTTSJobById = (jobId: string, options?: UseGetTTSJobByIdOptions) => {
  return useQuery<GetTTSJobByIdResponseT>({
    queryKey: ["get-tts-job-by-id", jobId],
    queryFn: () => getTTSJobByIdRequest(jobId),
    enabled: !!jobId,
    refetchInterval: options?.refetchInterval ?? false,
  });
};
