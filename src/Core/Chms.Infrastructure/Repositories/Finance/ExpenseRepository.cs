using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.IncomeExpense;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;

namespace Chms.Infrastructure;

public class ExpenseRepository : IExpenseRepository
{
    public readonly ChMSDbContext _dbContext;
    public readonly BaseRepository _baseRepository;
    public ExpenseRepository(ChMSDbContext dbContext, BaseRepository baseRepository)
    {
        _dbContext = dbContext;
        _baseRepository = baseRepository;
    }

    public const string TABLE_NAME = "expenses";

    public async Task<long> Create(Expense entity)
    {
        _dbContext.Expenses.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public void Delete(string expenseDate)
    {
        string sql = $"delete from {TABLE_NAME} where ExpenseDate = @Id";
        _baseRepository.LoadData<string, object>(sql, new { Id = expenseDate }).GetAwaiter().GetResult();
    }


    public List<Expense> Get(string expenseDate)
    { 
        string sql = $"select * from {TABLE_NAME} where ExpenseDate = @date";
        return _baseRepository.LoadData<Expense, object>(sql, new { date = expenseDate }).GetAwaiter().GetResult();
    }

    public List<ListVm> List(FilterVm query)
    {
        string sql = $"select Distinct Category, SUM(Amount) as TotalAmount from {TABLE_NAME} where 1 = 1 ";
        var whereSql = " and CAST(ExpenseDate as DateTime) between CAST(@startdate as DateTime) and CAST (@enddate as DateTime)";
        sql += whereSql;
        sql += $" group by Category";
        object where = new
        {
            startdate = query.StartDate,
            enddate = query.EndDate
        };
        return _baseRepository.LoadData<ListVm, object>(sql, where).GetAwaiter().GetResult();
    }

    public List<ListVm> TotalDataCount(FilterVm query)
    {
        string sql = $"select Distinct Category, SUM(Amount) as TotalAmount from {TABLE_NAME} where 1 = 1 ";
        sql += $" group by Category";
        return _baseRepository.LoadData<ListVm, object>(sql,new {}).GetAwaiter().GetResult();
    }


    public async Task Update(Expense entity)
    {
        List<string> constantField = new() { "Id", "CreatedBy", "CreatedDate" };
        var entry = _dbContext.Expenses.Attach(entity);
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