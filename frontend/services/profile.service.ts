import api from "./api";

export interface Profile {
  id: string;
  registrationNumber: string;
  fullName: string;
  phone: string;
  gender?: string;
}

export interface ProfilePayload {
  fullName: string;
  registrationNumber: string;
  phone: string;
  gender?: string;
}

export const getProfile = async (userId: string): Promise<Profile> => {
  const res = await api.get(`/profiles/${userId}`);
  return res.data.data;
};

export const createProfile = async (userId: string, payload: ProfilePayload) => {
  const res = await api.post("/profiles", { userId, ...payload });
  console.log("createProfile response:", JSON.stringify(res.data));
  return res.data;
};

export const updateProfile = async (userId: string, payload: ProfilePayload) => {
  const res = await api.put(`/profiles/${userId}`, payload);
  return res.data;
};