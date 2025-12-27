using Chms.Domain.Entities;
using Chms.Domain.ViewModels.IncomeExpense;

namespace Chms.Application.Common.Interface.Repositories;

public interface IIncomeRepository
{

    public Task<long> Create(Income entity);
    public Task Update(Income entity);
    public List<Income> Get(string incomeDate);
    public void Delete(string incomeDate);
    public List<ListVm> List(FilterVm query);
    public List<ListVm> TotalDataCount(FilterVm query);
}

public interface IExpenseRepository
{
    public Task<long> Create(Expense entity);
    public Task Update(Expense entity);
    public List<Expense> Get(string expenseDate);
    public void Delete(string expenseDate);
    public List<ListVm> List(FilterVm query);
    public List<ListVm> TotalDataCount(FilterVm query);

}