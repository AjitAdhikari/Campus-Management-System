namespace Chms.Domain.Entities;

public class Inventory : BaseModel
{
    public int Id {get; set;}
    public string? Name {get; set;}
    public string? Code {get; set;}
    public string? Quantity {get; set;}
    public string? Description { get; set; } = String.Empty;
    public string? Image {get; set;}
}
