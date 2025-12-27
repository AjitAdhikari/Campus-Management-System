using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;
using Chms.Domain.ViewModels.Documents;

namespace Chms.Infrastructure.Repositories.Document
{
    public class DocumentQueryRepository : IDocumentQueryRepository
    {
        public readonly BaseRepository _baseRepository;
        public const string TABLE_NAME = "documents";

        public DocumentQueryRepository(BaseRepository baseRepository)
        {
            _baseRepository = baseRepository;
        }

        public Domain.Entities.Document Get(string id)
        {
             string sql = $"select * from {TABLE_NAME} where Id = @Id";
            return _baseRepository.LoadSingleData<Domain.Entities.Document, object>(sql, new { Id = id })
                    .GetAwaiter().GetResult();
        }

        public int GetTotalData(FilterVm query)
        {
            var whereSql = (!String.IsNullOrEmpty(query.Name)) ? $" and Name like @name" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.CreatedDate)) ? $" and CAST(CreatedDate as date) = @date" : string.Empty;
            var totalDataSql = $"select COUNT(Id) as TotalCount from {TABLE_NAME} where 1 = 1" + whereSql;
            object where = new
            {
                name = $"%{query.Name}%",
                date = query.CreatedDate,
            };
            return _baseRepository.LoadSingleData<int, object>(totalDataSql, where).GetAwaiter().GetResult();
        }

        public List<Domain.Entities.Document> List(FilterVm query)
        {
            string sql = $"select * from {TABLE_NAME} where 1 = 1 ";
            var whereSql = (!String.IsNullOrEmpty(query.Name)) ? $" and Name like @name" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.CreatedDate)) ? $" and CAST(CreatedDate as date) = @date" : string.Empty;
            sql += whereSql;
            sql += $" order by CreatedDate desc OFFSET {query.Offset} ROWS FETCH NEXT {query.Limit} ROWS ONLY";
            object where = new
            {
                name = $"%{query.Name}%",
                date = query.CreatedDate
            };
            return _baseRepository.LoadData<Domain.Entities.Document, object>(sql, where).GetAwaiter().GetResult();
        }
    }
}