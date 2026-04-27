import api from "@/config/axios";
import { GetLibraryQueryT } from "@/schema/voices.schema";
import { GetLibraryResponseT } from "@/services/voices/types";
import { toQueryString } from "@/lib/utils";

export const getLibraryRequest = async (
  payload: GetLibraryQueryT,
): Promise<GetLibraryResponseT> => {
  const query = toQueryString(payload);
  const { data } = await api.get<GetLibraryResponseT>(`/library${query}`);
  return data;
};
