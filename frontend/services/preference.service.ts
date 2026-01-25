import api from "./api";
import { ApiResponse } from "./types";

export interface PreferencesPayload {
  sleepTime: string;
  studyHabit: string;
  visitorTolerance: string;
}

export const savePreferences = async (
  data: PreferencesPayload
): Promise<PreferencesPayload> => {
  const res = await api.post<ApiResponse<PreferencesPayload>>(
    "/preferences",
    data
  );
  return res.data.data;
};
