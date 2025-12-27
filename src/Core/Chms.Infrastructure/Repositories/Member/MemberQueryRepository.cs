using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Members;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Infrastructure.Repositories.Member
{
    public class MemberQueryRepository : IMemberQueryRepository
    {
        private readonly BaseRepository _baseRepository;
        public const string TABLE_NAME = "members";
        public MemberQueryRepository(BaseRepository baseRepository)
        {
            _baseRepository = baseRepository;
        }
        public Domain.Entities.Member Get(Guid id)
        {
            string sql = $"select * from {TABLE_NAME} where Id = @Id";
            return _baseRepository.LoadSingleData<Domain.Entities.Member, object>(sql, new { Id = id })
                    .GetAwaiter().GetResult();
        }

        public List<MemberListVM> List(FilterVm query)
        {
            string sql = $"select Id, FirstName, LastName, Email, PhoneNumber, Gender, GroupId, ChurchRole, CreatedDate, UpdatedDate, Photo from {TABLE_NAME} where 1=1 ";
            var whereSql = (!String.IsNullOrEmpty(query.Name)) ? $" and CONCAT(FirstName, MiddleName, LastName) like @name" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.PhoneNumber)) ? $" and PhoneNumber like @phoneNumber" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.Gender)) ? $" and Gender = @gender" : string.Empty;
             sql += whereSql;
            sql += $" order by CreatedDate desc OFFSET {query.Offset} ROWS FETCH NEXT {query.Limit} ROWS ONLY";
            object where = new
            {
                name = $"%{query.Name}%",
                phoneNumber = $"%{query.PhoneNumber}%",
                gender = query.Gender
            };
            return _baseRepository.LoadData<MemberListVM, object>(sql, where).GetAwaiter().GetResult();
        }

        public int TotalDataCount(FilterVm query)
        {
            var whereSql = (!String.IsNullOrEmpty(query.Name)) ? $" and CONCAT(FirstName, MiddleName, LastName) like @name" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.PhoneNumber)) ? $" and PhoneNumber like @phoneNumber" : string.Empty;
            whereSql += (!String.IsNullOrEmpty(query.Gender)) ? $" and Gender = @gender" : string.Empty;
            var totalDataSql = $"select COUNT(Id) as TotalCount from {TABLE_NAME} where 1 = 1" + whereSql;
            object where = new
            {
                name = $"%{query.Name}%",
                phoneNumber = $"%{query.PhoneNumber}%",
                gender = query.Gender
            };
            return _baseRepository.LoadSingleData<int, object>(totalDataSql, where).GetAwaiter().GetResult();
        }

        public List<MemberListVM> ListActiveMember()
        {
            string sql = $"select Id, FirstName, LastName, MiddleName from {TABLE_NAME}";
            return _baseRepository.LoadData<MemberListVM, object>(sql, new { }).GetAwaiter().GetResult();
        }
    }
}
