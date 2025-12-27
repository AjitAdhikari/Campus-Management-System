using Chms.Application.Common.Interface;
using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.IncomeExpense;

namespace Chms.Application.Services;

public class IncomeService : IIncomeService
{
    private readonly IIncomeRepository  _incomeRepository;
    public IncomeService(IIncomeRepository incomeRepository)
    {
        _incomeRepository = incomeRepository; 
    }
   
    public async Task<long> Create(Income entity)
    {
        return await _incomeRepository.Create(entity);
    }

    public void Delete(string incomeDate)
    {
        _incomeRepository.Delete(incomeDate);
    }

    public List<Income> Get(string incomeDate)
    {
        return _incomeRepository.Get(incomeDate);
    }


    public List<ListVm> List(FilterVm query)
    {
        return _incomeRepository.List(query);
    }


    public List<ListVm> TotalDataCount(FilterVm query)
    {
        return _incomeRepository.TotalDataCount(query);
    }


    public async Task Update(Income entity)
    {
        await _incomeRepository.Update(entity);
    }
}