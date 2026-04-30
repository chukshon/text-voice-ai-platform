import { useQuery } from "@tanstack/react-query";
import { GetTTSJobByIdResponseT, GetTTSJobsResponseT } from "./types";
import { getTTSJobByIdRequest, getTTSJobsRequest } from "./requests";

export const useGetTTSJobs = () => {
  return useQuery<GetTTSJobsResponseT>({
    queryKey: ["get-tts-jobs"],
    queryFn: () => getTTSJobsRequest(),
  });
};
export const useGetTTSJobById = (jobId: string) => {
  return useQuery<GetTTSJobByIdResponseT>({
    queryKey: ["get-tts-job-by-id", jobId],
    queryFn: () => getTTSJobByIdRequest(jobId),
  });
};
