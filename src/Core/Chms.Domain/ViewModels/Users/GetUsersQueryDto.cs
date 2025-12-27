namespace Chms.Domain.ViewModels.Users
{
    public class GetUsersQueryDto
    {
        public int Limit { get; set; } = 10;
        public int Offset { get; set; } = 0;
        public FilterVm RequestFilter {get; set;} = new();
    }
}