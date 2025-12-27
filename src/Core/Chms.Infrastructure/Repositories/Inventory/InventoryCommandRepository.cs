using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;

namespace Chms.Infrastructure;

public class InventoryCommandRepository : IInventoryCommandRepository
{
    public readonly ChMSDbContext _dbContext;
    public readonly BaseRepository _baseRepository;
    public InventoryCommandRepository(ChMSDbContext dbContext, BaseRepository baseRepository)
    {
        _dbContext = dbContext;
        _baseRepository = baseRepository;
    }
    public async Task<int> Create(Inventory entity)
    {
        _dbContext.Inventories.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public void Delete(int id)
    {
        string sql = "delete from `inventories` where Id = @Id";
        _baseRepository.LoadData<string, object>(sql, new { Id = id }).GetAwaiter().GetResult();
    }

    public async Task<int> Update(Inventory entity)
    {
        //_dbContext.Inventories.Update(entity);
        List<string> constantField = new() { "Id", "CreatedBy", "CreatedDate" };
        var entry = _dbContext.Inventories.Attach(entity);
        foreach (var property in entry.OriginalValues.Properties)
        {
            if (!constantField.Contains(property.Name))
            {
                entry.Property(property.Name).IsModified = true;
            }
        }
        return await _dbContext.SaveChangesAsync();
    }
}