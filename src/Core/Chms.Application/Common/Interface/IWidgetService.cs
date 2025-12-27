using Chms.Domain.ViewModels.Widgets;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Chms.Application.Common.Interface
{
    public interface IWidgetService
    {
        public Task<SummaryVm> GetSummaryData();
        public Task<List<ChartVm>> GetGenderChartData();
        public Task<List<ChartVm>> GetFinanceChartData();
    }
}
