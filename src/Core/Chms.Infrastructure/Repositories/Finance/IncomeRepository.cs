using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.IncomeExpense;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;

namespace Chms.Infrastructure;

public class IncomeRepository : IIncomeRepository
{
    public readonly ChMSDbContext _dbContext;
    public readonly BaseRepository _baseRepository;
    public IncomeRepository(ChMSDbContext dbContext, BaseRepository baseRepository)
    {
        _dbContext = dbContext;
        _baseRepository = baseRepository;
    }

    private const string TABLE_NAME = "incomes";

    public async Task<long> Create(Income entity)
    {
        _dbContext.Incomes.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public void Delete(string incomeDate)
    {
        string sql = $"delete from {TABLE_NAME} where IncomeDate = @date";
        _baseRepository.LoadData<string, object>(sql, new { date = incomeDate }).GetAwaiter().GetResult();
    }

    public List<Income> Get(string incomeDate)
    {
        string sql = $"select * from {TABLE_NAME} where IncomeDate = @date";
        return _baseRepository.LoadData<Income, object>(sql, new { date = incomeDate}).GetAwaiter().GetResult();
    }

    public List<ListVm> List(FilterVm query)
    {

        string sql = $"select Distinct Category, SUM(Amount) as TotalAmount from {TABLE_NAME} where 1 = 1 ";
        var whereSql = " and CAST(IncomeDate as DateTime) between CAST(@startdate as DateTime) and CAST (@enddate as DateTime)";
        sql += whereSql;
        sql += $" group by Category";
        object where = new
        {
            startdate = query.StartDate,
            enddate =  query.EndDate
        };
        return _baseRepository.LoadData<ListVm, object>(sql, where).GetAwaiter().GetResult();
    }

    public List<ListVm> TotalDataCount(FilterVm query)
    {
        string sql = $"select Distinct Category, SUM(Amount) as TotalAmount from {TABLE_NAME} where 1 = 1 ";
        sql += $" group by Category";
        return _baseRepository.LoadData<ListVm, object>(sql, new {}).GetAwaiter().GetResult();
    }


    public async Task Update(Income entity)
    {
        List<string> constantField = new() { "Id", "CreatedBy", "CreatedDate" };
        var entry = _dbContext.Incomes.Attach(entity);
        foreach (var property in entry.OriginalValues.Properties)
        {
            if (!constantField.Contains(property.Name))
            {
                entry.Property(property.Name).IsModified = true;
            }
        }
        await _dbContext.SaveChangesAsync();
    }
}