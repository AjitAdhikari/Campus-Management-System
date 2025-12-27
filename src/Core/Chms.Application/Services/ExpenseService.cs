using Chms.Application.Common.Interface;
using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.IncomeExpense;

namespace Chms.Application.Services;

public class ExpenseService : IExpenseService
{
    public readonly IExpenseRepository _repository;
    public ExpenseService(IExpenseRepository repository)
    {
    _repository = repository; 
    }

    public Task<long> Create(Expense entity)
    {
        return _repository.Create(entity);
    }

    public void Delete(string expenseDate)
    {
        _repository.Delete(expenseDate);
    }

    public List<Expense> Get(string expenseDate)
    {
       return _repository.Get(expenseDate);
    }

    public List<ListVm> List(FilterVm query)
    {
        return _repository.List(query);
    }

    public List<ListVm> TotalDataCount(FilterVm query)
    {
        return _repository.TotalDataCount(query);
    }

    public async Task Update(Expense entity)
    {
       await _repository.Update(entity);
    }
}