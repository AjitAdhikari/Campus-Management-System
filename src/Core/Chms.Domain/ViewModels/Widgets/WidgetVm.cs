using Chms.Domain.ViewModels;

namespace Chms.Domain.ViewModels.Widgets
{
    public class SummaryVm 
    {
        public int TotalIncome { get; set; } = 0;
        public int TotalExpense { get; set; } = 0;
        public int TotalMembers { get; set; } = 0;
        public int TotalItems { get; set; } = 0;
    }

    public class ChartVm
    {
        public string? Key { get; set; }
        public int Value { get; set; } = 0;
    }
}