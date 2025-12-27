using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;

namespace Chms.Infrastructure.Repositories.Document;

public class DocumentCommandRepository : IDocumentCommandRepository
{
    public readonly ChMSDbContext _dbContext;
    public readonly BaseRepository _baseRepository;
    public DocumentCommandRepository(ChMSDbContext dbContext, BaseRepository baseRepository)
    {
        _dbContext = dbContext;
        _baseRepository = baseRepository;
    }

    public async Task<Guid> Create(Domain.Entities.Document entity)
    {
        _dbContext.Documents.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public void Delete(string id)
    {
        string sql = "delete from documents where Id = @Id";
        _baseRepository.LoadData<string, object>(sql, new { Id = id }).GetAwaiter().GetResult();
    }

    public async Task Update(Domain.Entities.Document entity)
    {
        List<string> constantField = new() { "Id", "CreatedBy", "CreatedDate" };
        var entry = _dbContext.Documents.Attach(entity);
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