using Chms.Domain.ViewModels;

namespace Chms.Domain.ViewModels.IncomeExpense
{
    public class FilterVm : BaseVm
    {
        public string? StartDate {get; set;}
        public string? EndDate { get; set; }
    }

    public class ListVm
    {
        public string? Category { get; set; }
        public long TotalAmount { get; set; } = 0;
    }
}