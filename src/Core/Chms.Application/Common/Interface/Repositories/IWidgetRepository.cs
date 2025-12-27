using Chms.Domain.ViewModels.Widgets;
namespace Chms.Application.Common.Interface.Repositories
{
    public interface IWidgetRepository
    {
        public Task<SummaryVm> GetSummaryData();
        public Task<List<ChartVm>> GetGenderChartData();

    }
}