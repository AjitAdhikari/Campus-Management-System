// src/app/models/inventory.model.ts
export interface Inventory {
  id: number;
  name: string;
  code: string;
  quantity: string;
  description?: string;
  image?: string;
  created_at?: string;
}

export class FilterVm {
  limit: number = 20;
  offset: number = 0;
  name: string | null = "";
  code: string | null = "";
}
