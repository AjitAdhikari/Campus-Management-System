using Chms.Domain.Entities;

namespace ChMS.Web.ViewModels
{
    public class CreateDocumentVm
    {
        public IFormFile File {get; set;}
        public string Name {get; set;}
        public string? Description {get; set;}        
    }

    public class EditDocumentVm
    {
        public Guid Id {get; set;}
        public IFormFile? File { get; set; } = null;
        public string? Name {get; set;}
        public string? Description {get; set;}    
        public string? Size {get; set;}
        public string? Path {get; set;}
        public string? Type {get; set;}
        public string? CreatedDate {get; set;}
    }

    public class ListDocumentVm
    {
        public Guid Id {get; set;}
        public string? Name {get; set;}
        public string? Description {get; set;}   
        public string? Path {get; set;} 
        public string? CreatedDate {get; set;}
    }

    public class DocFilterQueryVm
    {
        public string? Name { get; set; }
        public string? CreatedDate { get; set; }
        public int Limit { get; set; } = 20;
        public int Offset { get; set; } = 0;
    }

    public class DocListResponseVm
    {
        public List<Document> Items { get; set; } = new();
        public int TotalDataCount { get; set; } = 0;
    }
}