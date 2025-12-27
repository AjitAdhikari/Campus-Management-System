// member.model.ts
export interface Member {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone_number?: string;
  secondary_phone_number?: string;
  birth_date: string;
  gender: string;
  occupation: string;
  permanent_address: string;
  temporary_address: string;
  baptized_date: string;
  membership_date?: string;
  photo?: string;
}

// member.model.ts
export interface ListMember {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  gender: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  photo?: string;
}

export class FilterVm {
  limit: number = 20;
  offset: number = 0;
  name: string | null = "";
  phone_number: string | null = "";
  gender : string | null = "";
}

