// src/app/models/inventory.model.ts
export interface Documents {
  id: number;
  name: string;
  size: string;
  path: string;
  description?: string;
  file?: string;
  type?: string;
  createdDate?: string | null | undefined ;
}

export class FilterVm {
  limit: number = 20;
  offset: number = 0;
  name: string | null = "";
  code: string | null = "";
}
