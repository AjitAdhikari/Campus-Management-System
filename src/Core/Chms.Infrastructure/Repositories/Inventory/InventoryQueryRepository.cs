using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;
using Chms.Domain.ViewModels.Inventories;

namespace Chms.Infrastructure;

public class InventoryQueryRepository : IInventoryQueryRepository
{
    public readonly BaseRepository _baseRepository;
    public const string TABLE_NAME = "inventories";
    public InventoryQueryRepository(BaseRepository baseRepository)
    {
        _baseRepository = baseRepository;
    }

    public Inventory Get(int id)
    {
          string sql = $"select * from {TABLE_NAME} where Id = @Id";
            return _baseRepository.LoadSingleData<Inventory, object>(sql, new { Id = id })
                    .GetAwaiter().GetResult();
        throw new NotImplementedException();
    }

    public List<Inventory> List(FilterVm query)
    {
           string sql = $"select * from {TABLE_NAME} where 1 = 1 ";
            var whereSql = (!String.IsNullOrEmpty(query.Name)) ? $" and Name like @name" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.Code)) ? $" and Code like @code" : string.Empty;
            sql += whereSql;
            sql += $" order by CreatedDate desc OFFSET {query.Offset} ROWS FETCH NEXT {query.Limit} ROWS ONLY";
            object where = new
            {
                name = $"%{query.Name}%",
                code = $"%{query.Code}%"
            };
            return _baseRepository.LoadData<Inventory, object>(sql, where).GetAwaiter().GetResult();
    }

    public int TotalDataCount(FilterVm query)
    {
        var whereSql = (!String.IsNullOrEmpty(query.Name)) ? $" and Name like @name" : string.Empty;
        whereSql += (!String.IsNullOrEmpty(query.Code)) ? $" and Code like @code" : string.Empty;
        var totalDataSql = $"select COUNT(Id) as TotalCount from {TABLE_NAME} where 1 = 1" + whereSql;
        object where = new
        {
            name = $"%{query.Name}%",
            code = $"%{query.Code}%",
        };
        return _baseRepository.LoadSingleData<int, object>(totalDataSql, where).GetAwaiter().GetResult();
    }
}