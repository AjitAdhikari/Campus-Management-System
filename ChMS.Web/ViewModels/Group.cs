namespace ChMS.Web.ViewModels;

public class CreateGroupVM
{
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? FellowshipRoutine { get; set; }
}

public class UpdateGroupVm : CreateGroupVM
{
        public int Id {get; set;}
}