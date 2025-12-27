namespace Chms.Domain.Entities;
public class Document : BaseModel
{
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Path {get; set;}
        public string? Size {get; set;}
        public string? Description { get; set; } 
}