using Chms.Application.Common.Interface;
using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.ViewModels.Widgets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Application.Services
{
    public class WidgetService : IWidgetService
    {
        public readonly IWidgetRepository _repo;
        public WidgetService(IWidgetRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ChartVm>> GetFinanceChartData()
        {
            var data = await _repo.GetSummaryData();

            if (data == null)
            {
                return new List<ChartVm>();  
            }

            return new List<ChartVm>
            {
                new() { Key = "Income", Value = data.TotalIncome },
                new() { Key = "Expense", Value = data.TotalExpense }
            };
        }

        public async Task<List<ChartVm>> GetGenderChartData()
        {
            return await _repo.GetGenderChartData();
        }



        public async Task<SummaryVm> GetSummaryData()
        {
            return await _repo.GetSummaryData();
        }
    }
}
