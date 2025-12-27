using Chms.Domain.Entities;

namespace ChMS.Web.ViewModels;
public  class CreateInventoryVM
{
    public string? Name {get; set;}
    public string? Code {get; set;}
    public string? Quantity {get; set;}
    public string? Description {get; set;}
    public IFormFile? ImageFile {get; set;}
}

public class EditInventoryVM : CreateInventoryVM
{
    public int Id {get; set;}   
    public string? Image {get; set;}
}

public class FilterQueryVm 
{
    public string? Name {get; set;}
    public string? Code {get; set;}
    public int Limit { get; set; } = 20;
    public int Offset { get; set; } = 0;
}

public class InventoryListResponseVm 
{
    public List<Inventory> Items {get; set;} = new();
    public int TotalDataCount {get; set;} = 0;
}