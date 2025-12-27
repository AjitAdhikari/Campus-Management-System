using Chms.Application.Common.Interface;
using Chms.Application.Common.Interface.Repositories;
using Chms.Domain.Entities;
using Chms.Domain.ViewModels.Documents;

namespace Chms.Application.Services
{
    public class DocumentService : IDocumentService
    {
        public readonly IDocumentCommandRepository _command;
        public readonly IDocumentQueryRepository _query;
        public DocumentService(IDocumentCommandRepository command, IDocumentQueryRepository query)
        {
            _command = command;
            _query = query;
        }

        public async Task<Guid> Create(Document entity)
        {
            return await _command.Create(entity);
        }

        public void Delete(string id)
        {
             _command.Delete(id);
        }

        public Document Get(string id)
        {
            return _query.Get(id);
        }

        public int TotalDataCount(FilterVm filterVm)
        {
            return _query.GetTotalData(filterVm);   
        }

        public List<Document> List(FilterVm filterVm)
        {
           return _query.List(filterVm);
        }

        public async Task Update(Document entity)
        {
           await _command.Update(entity);
        }
    }
}