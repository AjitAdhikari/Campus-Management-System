import { Helpers } from "src/app/helpers/Helpers";

// src/app/models/inventory.model.ts
export class Income {
  id: number = 0;
  category: string = "";
  amount: number = 0;
  description?: string;
  incomeDate: string = "";
  memberId: string = "9fd74d48-c045-4a48-81e2-70ee9316e71f";
}

export class ListFinance
{
  category : string = "";
  totalAmount: number = 0;
}



export class FilterVm {
  limit: number = 20;
  offset: number = 0;
  startDate: string | null = "";
  endDate: string | null = "";
}

export class AddIncome
{
  date: string = "";
  income: Income[] = [];
}

export class AddExpense
{
  date: string = "";
  expense: Expense[] = [];
}

export class Expense
{
  id: number = 0;
  category: string = "";
  amount: number = 0;
  description?: string;
  expenseDate: string = "";
}

export class ActiveMembers {
  id: string = "";
  firstname: string = "";
  middlename: string = "";
  lastname: string = "";

  get fullname(): string {
    // If middlename is optional, handle the concatenation accordingly
    return `${this.firstname} ${this.middlename ? this.middlename + ' ' : ''}${this.lastname}`;
  }
}


