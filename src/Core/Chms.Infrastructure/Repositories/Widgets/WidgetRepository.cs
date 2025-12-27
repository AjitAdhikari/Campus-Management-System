using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.ViewModels.Widgets;
using Chms.Infrastructure.DataAccess;

namespace Chms.Infrastructure.Repositories.Widgets;

public class WidgetRepository : IWidgetRepository
{
    public readonly BaseRepository _baseRepo;
    public WidgetRepository( BaseRepository baseRepo)
    {
        _baseRepo = baseRepo;
    }

    public async Task<List<ChartVm>> GetGenderChartData()
    {
        string sql = $"select  Gender as 'Key', Count(Id) as 'Value' from members group by Gender;";
        return await _baseRepo.LoadData<ChartVm, object>(sql, new { });
    }

    public async Task<SummaryVm> GetSummaryData()
    {
        string sql = $"SELECT (SELECT SUM(Amount) FROM incomes) AS TotalIncome,(SELECT SUM(Amount) FROM expenses) AS TotalExpense,(SELECT COUNT(Id) FROM members) AS TotalMembers,(SELECT COUNT(Id) FROM inventories) AS TotalItems;";
        return await _baseRepo.LoadSingleData<SummaryVm, object>(sql, new {});
    }
}