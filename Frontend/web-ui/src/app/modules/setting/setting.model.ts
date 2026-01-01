export class UpdatePassword
{
  id: number = 0;
  password: string = "";
  confirmPassword: string = "";
}

export interface UserProfileView {
  id: string;
  name: string;
  email: string;
  active_status?: number;
  role?: string;
  semesters?: string;
  subjects?: string;
  avatar?: string | null;
}

export interface UpdateUserProfilePayload {
  id: string;
  name: string;
  email: string;
  role?: string;
  subjects?: string;
  semesters?: string;
  active_status?: number;
  // avatar will be sent as File via FormData
}
