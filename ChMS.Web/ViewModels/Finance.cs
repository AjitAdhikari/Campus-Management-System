using System.Numerics;

namespace ChMS.Web.ViewModels
{
    public class Income
    {
        public long Id { get; set; } = 0;
        public string? Category { get; set; }
        public int Amount { get; set; }
        public string? IncomeDate { get; set; }
        public Guid MemberId { get; set; }
        public string? Description { get; set; }
    }

    public class Expense
    {
        public long Id { get; set; } = 0;
        public string? Category { get; set; }
        public int Amount { get; set; }
        public string? ExpenseDate { get; set; }
        public string? Description { get; set; }
    }

    public class AddExpense
    {
        public string? Date { get; set; }
        public List<Expense> Expense { get; set; } = new();
    }

    public class AddIncome
    {
        public string? Date { get; set; }
        public List<Income> Income { get; set; } = new();
    }

    public class ListIncome
    {
        public List<Income> Income { get; set; } = new();
    }

    public class EditIncome : AddIncome
    {
        public Guid Id {get; set;}
    }

    public class IncomeFilterQueryVm
    {
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public int Limit { get; set; } = 20;
        public int Offset { get; set; } = 0;
    }


}