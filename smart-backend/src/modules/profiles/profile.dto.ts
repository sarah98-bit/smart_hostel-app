export interface CreateProfileDTO {
  registrationNumber: string;
  fullName: string;
  phone: string;
  gender?: string;
  userId: string;
}

export interface UpdateProfileDTO {
  fullName?: string;
  phone?: string;
  gender?: string;
}